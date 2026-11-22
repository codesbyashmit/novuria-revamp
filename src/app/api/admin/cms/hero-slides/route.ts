import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';

const slideSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  italicAccent: z.string().optional(),
  eyebrowTag: z.string().optional(),
  imageUrl: z.string().url(),
  mobileImageUrl: z.string().url().optional().nullable(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  displayOrder: z.number().int().default(0),
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

  const slides = await db
    .select()
    .from(schema.heroSlides)
    .orderBy(asc(schema.heroSlides.displayOrder));

  return NextResponse.json({ slides });
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
    const parsed = slideSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    const s = parsed.data;

    if (s.id) {
      const [updated] = await db
        .update(schema.heroSlides)
        .set({
          title: s.title,
          subtitle: s.subtitle || null,
          italicAccent: s.italicAccent || null,
          eyebrowTag: s.eyebrowTag || null,
          imageUrl: s.imageUrl,
          mobileImageUrl: s.mobileImageUrl || null,
          ctaText: s.ctaText || null,
          ctaLink: s.ctaLink || null,
          secondaryCtaText: s.secondaryCtaText || null,
          secondaryCtaLink: s.secondaryCtaLink || null,
          displayOrder: s.displayOrder,
          isActive: s.isActive,
        })
        .where(eq(schema.heroSlides.id, s.id))
        .returning();

      return NextResponse.json({ success: true, slide: updated });
    }

    const [created] = await db
      .insert(schema.heroSlides)
      .values({
        title: s.title,
        subtitle: s.subtitle || null,
        italicAccent: s.italicAccent || null,
        eyebrowTag: s.eyebrowTag || null,
        imageUrl: s.imageUrl,
        mobileImageUrl: s.mobileImageUrl || null,
        ctaText: s.ctaText || null,
        ctaLink: s.ctaLink || null,
        secondaryCtaText: s.secondaryCtaText || null,
        secondaryCtaLink: s.secondaryCtaLink || null,
        displayOrder: s.displayOrder,
        isActive: s.isActive,
      })
      .returning();

    return NextResponse.json({ success: true, slide: created });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save slide', details: String(err) }, { status: 500 });
  }
}

