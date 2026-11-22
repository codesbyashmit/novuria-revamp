import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const validateCouponSchema = z.object({
  code: z.string().min(1),
  subtotalPaise: z.number().int().nonnegative(),
});

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = validateCouponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { code, subtotalPaise } = parsed.data;

    const [coupon] = await db
      .select()
      .from(schema.coupons)
      .where(eq(schema.coupons.code, code.toUpperCase().trim()))
      .limit(1);

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid or inactive privilege code',
      }, { status: 400 });
    }

    const now = new Date();
    if (coupon.validFrom && now < coupon.validFrom) {
      return NextResponse.json({
        valid: false,
        message: 'Privilege code is not yet active',
      }, { status: 400 });
    }

    if (coupon.validUntil && now > coupon.validUntil) {
      return NextResponse.json({
        valid: false,
        message: 'Privilege code has expired',
      }, { status: 400 });
    }

    if (coupon.totalUsageLimit && coupon.timesUsed >= coupon.totalUsageLimit) {
      return NextResponse.json({
        valid: false,
        message: 'Privilege code redemption limit reached',
      }, { status: 400 });
    }

    if (subtotalPaise < coupon.minSpendPaise) {
      const minRupees = Math.round(coupon.minSpendPaise / 100);
      return NextResponse.json({
        valid: false,
        message: `Privilege code requires a minimum acquisition value of ₹${minRupees}`,
      }, { status: 400 });
    }

    let discountPaise = 0;
    if (coupon.discountType === 'percentage') {
      discountPaise = Math.round((subtotalPaise * coupon.discountValue) / 100);
      if (coupon.maxDiscountPaise && discountPaise > coupon.maxDiscountPaise) {
        discountPaise = coupon.maxDiscountPaise;
      }
    } else {
      discountPaise = Math.min(coupon.discountValue, subtotalPaise);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountPaise,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      message: `Privilege code applied: ₹${Math.round(discountPaise / 100)} deduction`,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to validate coupon', details: String(err) }, { status: 500 });
  }
}

