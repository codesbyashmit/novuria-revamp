import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { getAnnouncementMessages, getCollections, getNavCategories } from '@/lib/data';
import Header from '@/components/layout/Header';
import ProductDetailClient from '@/components/pdp/ProductDetailClient';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!db) notFound();

  const [product] = await db
    .select({
      id: schema.products.id,
      name: schema.products.name,
      slug: schema.products.slug,
      description: schema.products.description,
      sku: schema.products.sku,
      basePricePaise: schema.products.basePricePaise,
      compareAtPricePaise: schema.products.compareAtPricePaise,
      categoryId: schema.products.categoryId,
    })
    .from(schema.products)
    .where(eq(schema.products.slug, slug))
    .limit(1);

  if (!product) notFound();

  let categoryName: string | undefined;
  let categorySlug: string | undefined;
  if (product.categoryId) {
    const [cat] = await db
      .select({ name: schema.categories.name, slug: schema.categories.slug })
      .from(schema.categories)
      .where(eq(schema.categories.id, product.categoryId))
      .limit(1);
    if (cat) {
      categoryName = cat.name;
      categorySlug = cat.slug;
    }
  }

  const [announcements, navCategories, collections, rawVariants, rawImages, rawReviews] =
    await Promise.all([
      getAnnouncementMessages(),
      getNavCategories(),
      getCollections(),
      db
        .select({
          id: schema.productVariants.id,
          sku: schema.productVariants.sku,
          color: schema.productVariants.color,
          colorHex: schema.productVariants.colorHex,
          size: schema.productVariants.size,
          pricePaise: schema.productVariants.pricePaise,
          compareAtPricePaise: schema.productVariants.compareAtPricePaise,
          quantityOnHand: schema.inventory.quantityOnHand,
          reservedQuantity: schema.inventory.reservedQuantity,
        })
        .from(schema.productVariants)
        .leftJoin(
          schema.inventory,
          eq(schema.productVariants.id, schema.inventory.variantId)
        )
        .where(eq(schema.productVariants.productId, product.id)),
      db
        .select({
          id: schema.productImages.id,
          url: schema.productImages.imageUrl,
          altText: schema.productImages.altText,
        })
        .from(schema.productImages)
        .where(eq(schema.productImages.productId, product.id))
        .orderBy(schema.productImages.displayOrder),
      db
        .select({
          id: schema.reviews.id,
          rating: schema.reviews.rating,
          title: schema.reviews.title,
          comment: schema.reviews.comment,
          fitMeter: schema.reviews.fitMeter,
          createdAt: schema.reviews.createdAt,
        })
        .from(schema.reviews)
        .where(
          and(
            eq(schema.reviews.productId, product.id),
            eq(schema.reviews.moderationStatus, 'approved')
          )
        )
        .orderBy(desc(schema.reviews.createdAt)),
    ]);

  const variants = rawVariants.map((v) => ({
    id: v.id,
    sku: v.sku,
    color: v.color,
    colorHex: v.colorHex,
    size: v.size,
    pricePaise: v.pricePaise,
    compareAtPricePaise: v.compareAtPricePaise,
    stockOnHand: Math.max(0, (v.quantityOnHand ?? 10) - (v.reservedQuantity ?? 0)),
  }));

  const reviews = rawReviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.comment,
    fitRating: r.fitMeter,
    createdAt: r.createdAt.toLocaleDateString('en-IN'),
  }));

  return (
    <div className="min-h-screen bg-[#FFF7FA] text-[#241726]">
      <Header
        announcement={announcements[0] || null}
        categories={navCategories}
        collections={collections}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <ProductDetailClient
          product={{
            ...product,
            categoryName,
            categorySlug,
          }}
          variants={variants}
          images={rawImages}
          reviews={reviews}
        />
      </main>
    </div>
  );
}
