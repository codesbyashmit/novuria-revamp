import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';

const updateModulesSchema = z.object({
  modules: z.array(
    z.object({
      id: z.string().uuid(),
      displayOrder: z.number().int(),
      isEnabled: z.boolean(),
    })
  ),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  const modules = await db
    .select()
    .from(schema.homepageModules)
    .orderBy(asc(schema.homepageModules.displayOrder));

  return NextResponse.json({ modules });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = updateModulesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    for (const m of parsed.data.modules) {
      await db
        .update(schema.homepageModules)
        .set({
          displayOrder: m.displayOrder,
          isEnabled: m.isEnabled,
          updatedAt: new Date(),
        })
        .where(eq(schema.homepageModules.id, m.id));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update modules', details: String(err) }, { status: 500 });
  }
}

