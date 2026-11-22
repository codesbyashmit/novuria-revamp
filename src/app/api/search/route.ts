import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { ilike, or, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q) {
    return NextResponse.json({
      products: [],
      categories: [],
      collections: [],
      suggestions: [],
      count: 0,
    });
  }

  try {
    await db.insert(schema.searchQueries).values({
      query: q,
      resultCount: 0,
    });
  } catch {}

  const searchPattern = `%${q}%`;

  const matchingCategories = await db
    .select({
      id: schema.categories.id,
      name: schema.categories.name,
      slug: schema.categories.slug,
    })
    .from(schema.categories)
    .where(ilike(schema.categories.name, searchPattern))
    .limit(5);

  const matchingCollections = await db
    .select({
      id: schema.collections.id,
      title: schema.collections.title,
      slug: schema.collections.slug,
    })
    .from(schema.collections)
    .where(ilike(schema.collections.title, searchPattern))
    .limit(4);

  const matchingProducts = await db
    .select({
      id: schema.products.id,
      name: schema.products.name,
      slug: schema.products.slug,
      description: schema.products.description,
      basePricePaise: schema.products.basePricePaise,
      compareAtPricePaise: schema.products.compareAtPricePaise,
      sku: schema.products.sku,
      badges: schema.products.badges,
    })
    .from(schema.products)
    .where(
      or(
        ilike(schema.products.name, searchPattern),
        ilike(schema.products.description, searchPattern),
        sql`similarity(${schema.products.name}, ${q}) > 0.15`
      )
    )
    .limit(16);

  const productIds = matchingProducts.map((p) => p.id);

  const imageMap: Record<string, string> = {};
  if (productIds.length > 0) {
    const images = await db
      .select({
        productId: schema.productImages.productId,
        imageUrl: schema.productImages.imageUrl,
      })
      .from(schema.productImages)
      .where(sql`${schema.productImages.productId} IN ${productIds}`);

    images.forEach((img) => {
      if (img.productId && !imageMap[img.productId]) {
        imageMap[img.productId] = img.imageUrl;
      }
    });
  }

  const productsWithImages = matchingProducts.map((p) => ({
    ...p,
    imageUrl: imageMap[p.id] || null,
  }));

  const suggestions = [
    ...matchingCategories.map((c) => ({ type: 'category', text: c.name, href: `/category/${c.slug}` })),
    ...matchingCollections.map((c) => ({ type: 'collection', text: c.title, href: `/collection/${c.slug}` })),
  ];

  return NextResponse.json({
    products: productsWithImages,
    categories: matchingCategories,
    collections: matchingCollections,
    suggestions,
    count: productsWithImages.length,
    query: q,
  });
}

