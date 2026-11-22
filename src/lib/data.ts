import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function getNavCategories() {
  if (!db) return [];
  return db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.isNav, true))
    .orderBy(schema.categories.displayOrder);
}

export async function getCollections() {
  if (!db) return [];
  return db
    .select()
    .from(schema.collections)
    .orderBy(schema.collections.displayOrder);
}

export async function getPromotions() {
  if (!db) return [];
  return db
    .select()
    .from(schema.promotions)
    .where(eq(schema.promotions.isActive, true));
}

export async function getNewArrivals() {
  if (!db) return [];
  return db
    .select()
    .from(schema.products)
    .where(eq(schema.products.isNewArrival, true))
    .orderBy(desc(schema.products.createdAt));
}

export async function getOccasionProducts(occasion?: string) {
  if (!db) return [];
  if (occasion) {
    return db
      .select()
      .from(schema.products)
      .where(eq(schema.products.occasion, occasion))
      .orderBy(desc(schema.products.createdAt));
  }
  return db
    .select()
    .from(schema.products)
    .where(eq(schema.products.isFeatured, true))
    .orderBy(desc(schema.products.createdAt));
}

export async function getBestsellers() {
  if (!db) return [];
  return db
    .select()
    .from(schema.products)
    .where(eq(schema.products.isBestseller, true))
    .orderBy(desc(schema.products.createdAt));
}

export async function getFeaturedBundle() {
  if (!db) return null;
  const result = await db.select().from(schema.bundles).limit(1);
  return result[0] || null;
}

export async function getLookbookStories() {
  if (!db) return [];
  return db
    .select()
    .from(schema.lookbookStories)
    .orderBy(schema.lookbookStories.displayOrder);
}
