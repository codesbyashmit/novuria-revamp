import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

const adSlotSchema = z.object({
  id: z.string().uuid().optional(),
  slotKey: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  badge: z.string().optional(),
  code: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  priority: z.number().int().default(1),
  deviceTarget: z.string().default('all'),
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

  const slots = await db
    .select()
    .from(schema.adSlots)
    .orderBy(desc(schema.adSlots.priority));

  return NextResponse.json({ adSlots: slots });
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
    const parsed = adSlotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const a = parsed.data;

    if (a.id) {
      const [updated] = await db
        .update(schema.adSlots)
        .set({
          slotKey: a.slotKey,
          name: a.name,
          title: a.title,
          subtitle: a.subtitle || null,
          badge: a.badge || null,
          code: a.code || null,
          imageUrl: a.imageUrl || null,
          linkUrl: a.linkUrl || null,
          buttonText: a.buttonText || null,
          priority: a.priority,
          deviceTarget: a.deviceTarget,
          isActive: a.isActive,
        })
        .where(eq(schema.adSlots.id, a.id))
        .returning();

      return NextResponse.json({ success: true, adSlot: updated });
    }

    const [created] = await db
      .insert(schema.adSlots)
      .values({
        slotKey: a.slotKey,
        name: a.name,
        title: a.title,
        subtitle: a.subtitle || null,
        badge: a.badge || null,
        code: a.code || null,
        imageUrl: a.imageUrl || null,
        linkUrl: a.linkUrl || null,
        buttonText: a.buttonText || null,
        priority: a.priority,
        deviceTarget: a.deviceTarget,
        isActive: a.isActive,
      })
      .returning();

    return NextResponse.json({ success: true, adSlot: created });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save ad slot', details: String(err) }, { status: 500 });
  }
}

