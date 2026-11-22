import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  displayOrder: z.number().int().default(0),
  isNav: z.boolean().default(true),
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
    .from(schema.categories)
    .orderBy(asc(schema.categories.displayOrder));

  return NextResponse.json({ categories: list });
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
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const d = parsed.data;

    if (d.id) {
      const [updated] = await db
        .update(schema.categories)
        .set({
          name: d.name,
          slug: d.slug,
          description: d.description || null,
          imageUrl: d.imageUrl || null,
          displayOrder: d.displayOrder,
          isNav: d.isNav,
        })
        .where(eq(schema.categories.id, d.id))
        .returning();
      return NextResponse.json({ success: true, category: updated });
    }

    const [created] = await db
      .insert(schema.categories)
      .values({
        name: d.name,
        slug: d.slug,
        description: d.description || null,
        imageUrl: d.imageUrl || null,
        displayOrder: d.displayOrder,
        isNav: d.isNav,
      })
      .returning();

    return NextResponse.json({ success: true, category: created });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save category', details: String(err) }, { status: 500 });
  }
}

