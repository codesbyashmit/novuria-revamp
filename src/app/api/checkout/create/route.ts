import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';
import { eq, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { z } from 'zod';

const checkoutSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  shippingMethodCode: z.string().default('STANDARD'),
  couponCode: z.string().optional().nullable(),
  paymentMethod: z.enum(['razorpay', 'cod']).default('razorpay'),
});

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const d = parsed.data;
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const cartToken = cookieStore.get('novuria_cart_token')?.value;

    let cartId: string | null = null;
    if (user) {
      const [userCart] = await db
        .select()
        .from(schema.carts)
        .where(eq(schema.carts.userId, user.id))
        .limit(1);
      if (userCart) cartId = userCart.id;
    } else if (cartToken) {
      const [guestCart] = await db
        .select()
        .from(schema.carts)
        .where(eq(schema.carts.sessionToken, cartToken))
        .limit(1);
      if (guestCart) cartId = guestCart.id;
    }

    if (!cartId) {
      return NextResponse.json({ error: 'Your atelier bag is empty' }, { status: 400 });
    }

    const items = await db
      .select({
        cartItemId: schema.cartItems.id,
        quantity: schema.cartItems.quantity,
        variantId: schema.productVariants.id,
        sku: schema.productVariants.sku,
        color: schema.productVariants.color,
        size: schema.productVariants.size,
        pricePaise: schema.productVariants.pricePaise,
        productId: schema.products.id,
        productName: schema.products.name,
      })
      .from(schema.cartItems)
      .innerJoin(schema.productVariants, eq(schema.cartItems.variantId, schema.productVariants.id))
      .innerJoin(schema.products, eq(schema.productVariants.productId, schema.products.id))
      .where(eq(schema.cartItems.cartId, cartId));

    if (items.length === 0) {
      return NextResponse.json({ error: 'Your atelier bag is empty' }, { status: 400 });
    }

    const subtotalPaise = items.reduce((acc, item) => acc + item.pricePaise * item.quantity, 0);

    let discountPaise = 0;
    if (d.couponCode) {
      const [coupon] = await db
        .select()
        .from(schema.coupons)
        .where(eq(schema.coupons.code, d.couponCode.toUpperCase().trim()))
        .limit(1);

      if (coupon && coupon.isActive && subtotalPaise >= coupon.minSpendPaise) {
        if (coupon.discountType === 'percentage') {
          discountPaise = Math.round((subtotalPaise * coupon.discountValue) / 100);
          if (coupon.maxDiscountPaise && discountPaise > coupon.maxDiscountPaise) {
            discountPaise = coupon.maxDiscountPaise;
          }
        } else {
          discountPaise = Math.min(coupon.discountValue, subtotalPaise);
        }

        await db
          .update(schema.coupons)
          .set({ timesUsed: coupon.timesUsed + 1 })
          .where(eq(schema.coupons.id, coupon.id));
      }
    }

    const [shippingMethod] = await db
      .select()
      .from(schema.shippingMethods)
      .where(eq(schema.shippingMethods.code, d.shippingMethodCode))
      .limit(1);

    let shippingPaise = shippingMethod ? shippingMethod.pricePaise : 25000;
    const freeThreshold = shippingMethod?.freeThresholdPaise ?? 500000;
    if (subtotalPaise >= freeThreshold) {
      shippingPaise = 0;
    }

    const netTaxablePaise = Math.max(0, subtotalPaise - discountPaise);
    const taxPaise = Math.round(netTaxablePaise * 0.12);
    const totalAmountPaise = netTaxablePaise + shippingPaise;

    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderNumber = `NOV-26-${randomSuffix}`;

    const addressSnapshot = {
      fullName: d.fullName,
      phone: d.phone,
      email: d.email,
      addressLine1: d.addressLine1,
      addressLine2: d.addressLine2 || '',
      city: d.city,
      state: d.state,
      pincode: d.pincode,
    };

    const [createdOrder] = await db
      .insert(schema.orders)
      .values({
        orderNumber,
        userId: user ? user.id : null,
        guestEmail: user ? null : d.email,
        guestPhone: user ? null : d.phone,
        status: d.paymentMethod === 'cod' ? 'placed' : 'pending_payment',
        subtotalPaise,
        discountPaise,
        shippingPaise,
        taxPaise,
        totalAmountPaise,
        shippingAddressSnapshot: addressSnapshot,
        paymentMethod: d.paymentMethod,
        paymentStatus: d.paymentMethod === 'cod' ? 'pending' : 'pending',
      })
      .returning();

    for (const item of items) {
      await db.insert(schema.orderItems).values({
        orderId: createdOrder.id,
        productId: item.productId,
        variantId: item.variantId,
        titleSnapshot: item.productName,
        skuSnapshot: item.sku,
        colorSnapshot: item.color,
        sizeSnapshot: item.size,
        pricePaiseSnapshot: item.pricePaise,
        quantity: item.quantity,
        subtotalPaise: item.pricePaise * item.quantity,
      });

      await db
        .update(schema.inventory)
        .set({
          reservedQuantity: sql`${schema.inventory.reservedQuantity} + ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(schema.inventory.variantId, item.variantId));
    }

    await db.insert(schema.orderStatusHistory).values({
      orderId: createdOrder.id,
      fromStatus: null,
      toStatus: d.paymentMethod === 'cod' ? 'placed' : 'pending_payment',
      comment: d.paymentMethod === 'cod' ? 'Order placed with Cash on Delivery' : 'Awaiting payment authorization',
    });

    await db.delete(schema.cartItems).where(eq(schema.cartItems.cartId, cartId));

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: createdOrder.id,
      totalAmountPaise,
      paymentMethod: d.paymentMethod,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process acquisition', details: String(err) }, { status: 500 });
  }
}

