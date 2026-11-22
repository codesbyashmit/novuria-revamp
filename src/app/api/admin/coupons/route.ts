import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

const couponSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(2),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed_amount']),
  discountValue: z.number().int().positive(),
  minOrderPaise: z.number().int().default(0),
  maxDiscountPaise: z.number().int().optional().nullable(),
  usageLimit: z.number().int().optional().nullable(),
  validFrom: z.string().datetime().optional().nullable(),
  validUntil: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  const list = await db
    .select()
    .from(schema.coupons)
    .orderBy(desc(schema.coupons.createdAt));

  return NextResponse.json({ coupons: list });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const c = parsed.data;

    if (c.id) {
      const [updated] = await db
        .update(schema.coupons)
        .set({
          code: c.code.toUpperCase(),
          description: c.description || null,
          discountType: c.discountType,
          discountValue: c.discountValue,
          minOrderPaise: c.minOrderPaise,
          maxDiscountPaise: c.maxDiscountPaise || null,
          usageLimit: c.usageLimit || null,
          validFrom: c.validFrom ? new Date(c.validFrom) : null,
          validUntil: c.validUntil ? new Date(c.validUntil) : null,
          isActive: c.isActive,
          updatedAt: new Date(),
        })
        .where(eq(schema.coupons.id, c.id))
        .returning();

      return NextResponse.json({ success: true, coupon: updated });
    }

    const [created] = await db
      .insert(schema.coupons)
      .values({
        code: c.code.toUpperCase(),
        description: c.description || null,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderPaise: c.minOrderPaise,
        maxDiscountPaise: c.maxDiscountPaise || null,
        usageLimit: c.usageLimit || null,
        validFrom: c.validFrom ? new Date(c.validFrom) : null,
        validUntil: c.validUntil ? new Date(c.validUntil) : null,
        isActive: c.isActive,
      })
      .returning();

    return NextResponse.json({ success: true, coupon: created });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save coupon', details: String(err) }, { status: 500 });
  }
}

