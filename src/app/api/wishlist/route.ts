import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ items: [], count: 0 });
  }

  const [wishlist] = await db
    .select()
    .from(schema.wishlists)
    .where(eq(schema.wishlists.userId, user.id))
    .limit(1);

  if (!wishlist) {
    return NextResponse.json({ items: [], count: 0 });
  }

  const items = await db
    .select({
      wishlistItemId: schema.wishlistItems.id,
      productId: schema.products.id,
      name: schema.products.name,
      slug: schema.products.slug,
      basePricePaise: schema.products.basePricePaise,
      compareAtPricePaise: schema.products.compareAtPricePaise,
      sku: schema.products.sku,
    })
    .from(schema.wishlistItems)
    .innerJoin(schema.products, eq(schema.wishlistItems.productId, schema.products.id))
    .where(eq(schema.wishlistItems.wishlistId, wishlist.id));

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

  const formatted = items.map((i) => ({
    id: i.wishlistItemId,
    productId: i.productId,
    name: i.name,
    slug: i.slug,
    basePricePaise: i.basePricePaise,
    compareAtPricePaise: i.compareAtPricePaise,
    sku: i.sku,
    imageUrl: imageMap[i.productId] || null,
  }));

  return NextResponse.json({ items: formatted, count: formatted.length });
}

const toggleSchema = z.object({
  productId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Please inscribe/login to save to your atelier wishlist' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = toggleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const { productId } = parsed.data;

    let [wishlist] = await db
      .select()
      .from(schema.wishlists)
      .where(eq(schema.wishlists.userId, user.id))
      .limit(1);

    if (!wishlist) {
      const [newWishlist] = await db
        .insert(schema.wishlists)
        .values({
          userId: user.id,
          name: 'Atelier Wishlist',
        })
        .returning();
      wishlist = newWishlist;
    }

    const [existing] = await db
      .select()
      .from(schema.wishlistItems)
      .where(
        and(
          eq(schema.wishlistItems.wishlistId, wishlist.id),
          eq(schema.wishlistItems.productId, productId)
        )
      )
      .limit(1);

    if (existing) {
      await db.delete(schema.wishlistItems).where(eq(schema.wishlistItems.id, existing.id));
      return NextResponse.json({ saved: false, message: 'Specimen removed from wishlist' });
    }

    await db.insert(schema.wishlistItems).values({
      wishlistId: wishlist.id,
      productId,
    });

    return NextResponse.json({ saved: true, message: 'Specimen preserved in wishlist' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update wishlist', details: String(err) }, { status: 500 });
  }
}

