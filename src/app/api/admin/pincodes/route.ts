import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { asc } from 'drizzle-orm';
import { z } from 'zod';

const pincodeSchema = z.object({
  id: z.string().uuid().optional(),
  pincode: z.string().min(6).max(10),
  city: z.string().min(1),
  state: z.string().min(1),
  isServiceable: z.boolean().default(true),
  isCodAvailable: z.boolean().default(true),
  estimatedDaysMin: z.number().int().default(2),
  estimatedDaysMax: z.number().int().default(5),
  standardFeePaise: z.number().int().default(0),
  expressAvailable: z.boolean().default(false),
  expressFeePaise: z.number().int().default(49900),
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
    .from(schema.pincodeServiceability)
    .orderBy(asc(schema.pincodeServiceability.pincode));

  return NextResponse.json({ pincodes: list });
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
    const parsed = pincodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const p = parsed.data;

    const [saved] = await db
      .insert(schema.pincodeServiceability)
      .values(p)
      .onConflictDoUpdate({
        target: schema.pincodeServiceability.pincode,
        set: {
          city: p.city,
          state: p.state,
          isServiceable: p.isServiceable,
          isCodAvailable: p.isCodAvailable,
          estimatedDaysMin: p.estimatedDaysMin,
          estimatedDaysMax: p.estimatedDaysMax,
          standardFeePaise: p.standardFeePaise,
          expressAvailable: p.expressAvailable,
          expressFeePaise: p.expressFeePaise,
        },
      })
      .returning();

    return NextResponse.json({ success: true, pincode: saved });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save pincode', details: String(err) }, { status: 500 });
  }
}
