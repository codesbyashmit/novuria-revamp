import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

const moderateReviewSchema = z.object({
  reviewId: z.string().uuid(),
  status: z.enum(['pending', 'approved', 'rejected']),
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
    .select({
      id: schema.reviews.id,
      productId: schema.reviews.productId,
      productName: schema.products.name,
      rating: schema.reviews.rating,
      title: schema.reviews.title,
      comment: schema.reviews.comment,
      fitMeter: schema.reviews.fitMeter,
      isVerifiedPurchase: schema.reviews.isVerifiedPurchase,
      moderationStatus: schema.reviews.moderationStatus,
      createdAt: schema.reviews.createdAt,
    })
    .from(schema.reviews)
    .innerJoin(schema.products, eq(schema.reviews.productId, schema.products.id))
    .orderBy(desc(schema.reviews.createdAt));

  const photos = await db.select().from(schema.reviewPhotos);

  const reviewsWithPhotos = list.map((r) => ({
    ...r,
    photos: photos.filter((p) => p.reviewId === r.id),
  }));

  return NextResponse.json({ reviews: reviewsWithPhotos });
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
    const parsed = moderateReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { reviewId, status } = parsed.data;

    const [updated] = await db
      .update(schema.reviews)
      .set({
        moderationStatus: status,
        updatedAt: new Date(),
      })
      .where(eq(schema.reviews.id, reviewId))
      .returning();

    return NextResponse.json({ success: true, review: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update review status', details: String(err) }, { status: 500 });
  }
}

