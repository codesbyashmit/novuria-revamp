import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';
import { and, eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { z } from 'zod';

async function getOrCreateCartId(): Promise<{ cartId: string; isNewCookie: boolean; cartToken: string }> {
  if (!db) throw new Error('Database not initialized');

  const user = await getCurrentUser();
  const cookieStore = await cookies();
  let cartToken = cookieStore.get('novuria_cart_token')?.value;

  if (user) {
    const [userCart] = await db
      .select()
      .from(schema.carts)
      .where(eq(schema.carts.userId, user.id))
      .limit(1);

    if (userCart) {
      if (cartToken) {
        const [guestCart] = await db
          .select()
          .from(schema.carts)
          .where(eq(schema.carts.sessionToken, cartToken))
          .limit(1);

        if (guestCart && guestCart.id !== userCart.id) {
          const guestItems = await db
            .select()
            .from(schema.cartItems)
            .where(eq(schema.cartItems.cartId, guestCart.id));

          for (const item of guestItems) {
            const [existing] = await db
              .select()
              .from(schema.cartItems)
              .where(
                and(
                  eq(schema.cartItems.cartId, userCart.id),
                  eq(schema.cartItems.variantId, item.variantId)
                )
              )
              .limit(1);

            if (existing) {
              await db
                .update(schema.cartItems)
                .set({ quantity: existing.quantity + item.quantity })
                .where(eq(schema.cartItems.id, existing.id));
            } else {
              await db.insert(schema.cartItems).values({
                cartId: userCart.id,
                variantId: item.variantId,
                quantity: item.quantity,
              });
            }
          }

          await db.delete(schema.carts).where(eq(schema.carts.id, guestCart.id));
        }
      }
      return { cartId: userCart.id, isNewCookie: false, cartToken: cartToken || '' };
    }

    const [newUserCart] = await db
      .insert(schema.carts)
      .values({ userId: user.id })
      .returning();
    return { cartId: newUserCart.id, isNewCookie: false, cartToken: cartToken || '' };
  }

  if (cartToken) {
    const [existingGuestCart] = await db
      .select()
      .from(schema.carts)
      .where(eq(schema.carts.sessionToken, cartToken))
      .limit(1);

    if (existingGuestCart) {
      return { cartId: existingGuestCart.id, isNewCookie: false, cartToken };
    }
  }

  cartToken = crypto.randomBytes(24).toString('hex');

  const [newGuestCart] = await db
    .insert(schema.carts)
    .values({ sessionToken: cartToken })
    .returning();

  return { cartId: newGuestCart.id, isNewCookie: true, cartToken };
}

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const { cartId, isNewCookie, cartToken } = await getOrCreateCartId();

    const items = await db
      .select({
        cartItemId: schema.cartItems.id,
        quantity: schema.cartItems.quantity,
        variantId: schema.productVariants.id,
        sku: schema.productVariants.sku,
        color: schema.productVariants.color,
        colorHex: schema.productVariants.colorHex,
        size: schema.productVariants.size,
        pricePaise: schema.productVariants.pricePaise,
        compareAtPricePaise: schema.productVariants.compareAtPricePaise,
        productId: schema.products.id,
        productName: schema.products.name,
        productSlug: schema.products.slug,
      })
      .from(schema.cartItems)
      .innerJoin(schema.productVariants, eq(schema.cartItems.variantId, schema.productVariants.id))
      .innerJoin(schema.products, eq(schema.productVariants.productId, schema.products.id))
      .where(eq(schema.cartItems.cartId, cartId));

    const productIds = items.map((i) => i.productId);
    const imageMap: Record<string, string> = {};
    if (productIds.length > 0) {
      const images = await db
        .select({
          productId: schema.productImages.productId,
          imageUrl: schema.productImages.imageUrl,
        })
        .from(schema.productImages);

      images.forEach((img) => {
        if (img.productId && !imageMap[img.productId]) {
          imageMap[img.productId] = img.imageUrl;
        }
      });
    }

    const formattedItems = items.map((i) => ({
      id: i.cartItemId,
      variantId: i.variantId,
      productId: i.productId,
      name: i.productName,
      slug: i.productSlug,
      sku: i.sku,
      color: i.color,
      colorHex: i.colorHex,
      size: i.size,
      pricePaise: i.pricePaise,
      compareAtPricePaise: i.compareAtPricePaise,
      quantity: i.quantity,
      lineTotalPaise: i.pricePaise * i.quantity,
      imageUrl: imageMap[i.productId] || null,
    }));

    const subtotalPaise = formattedItems.reduce((acc, curr) => acc + curr.lineTotalPaise, 0);
    const totalItems = formattedItems.reduce((acc, curr) => acc + curr.quantity, 0);

    const res = NextResponse.json({
      cartId,
      items: formattedItems,
      subtotalPaise,
      totalItems,
    });

    if (isNewCookie && cartToken) {
      res.cookies.set('novuria_cart_token', cartToken, {
        httpOnly: true,
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve bag', details: String(err) }, { status: 500 });
  }
}

const addToCartSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().positive().default(1),
});

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = addToCartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid variant selection' }, { status: 400 });
    }

    const { variantId, quantity } = parsed.data;
    const { cartId, isNewCookie, cartToken } = await getOrCreateCartId();

    const [existing] = await db
      .select()
      .from(schema.cartItems)
      .where(
        and(
          eq(schema.cartItems.cartId, cartId),
          eq(schema.cartItems.variantId, variantId)
        )
      )
      .limit(1);

    if (existing) {
      await db
        .update(schema.cartItems)
        .set({
          quantity: existing.quantity + quantity,
          updatedAt: new Date(),
        })
        .where(eq(schema.cartItems.id, existing.id));
    } else {
      await db.insert(schema.cartItems).values({
        cartId,
        variantId,
        quantity,
      });
    }

    const res = NextResponse.json({ success: true, message: 'Garment inscribed to bag' });
    if (isNewCookie && cartToken) {
      res.cookies.set('novuria_cart_token', cartToken, {
        httpOnly: true,
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
    }
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add item to bag', details: String(err) }, { status: 500 });
  }
}

const updateCartSchema = z.object({
  cartItemId: z.string().uuid(),
  quantity: z.number().int().nonnegative(),
});

export async function PATCH(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = updateCartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid update request' }, { status: 400 });
    }

    const { cartItemId, quantity } = parsed.data;

    if (quantity === 0) {
      await db.delete(schema.cartItems).where(eq(schema.cartItems.id, cartItemId));
    } else {
      await db
        .update(schema.cartItems)
        .set({
          quantity,
          updatedAt: new Date(),
        })
        .where(eq(schema.cartItems.id, cartItemId));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update bag item', details: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('id');

    if (!cartItemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    await db.delete(schema.cartItems).where(eq(schema.cartItems.id, cartItemId));

    return NextResponse.json({ success: true, message: 'Garment removed from bag' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to remove item', details: String(err) }, { status: 500 });
  }
}

