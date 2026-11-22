import { db } from '@/db';
import * as schema from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';

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

export async function getHeroSlides() {
  if (!db) return [];
  return db
    .select()
    .from(schema.heroSlides)
    .where(eq(schema.heroSlides.isActive, true))
    .orderBy(schema.heroSlides.displayOrder);
}

export async function getAdSlots(slotKey?: string) {
  if (!db) return [];
  if (slotKey) {
    return db
      .select()
      .from(schema.adSlots)
      .where(and(eq(schema.adSlots.slotKey, slotKey), eq(schema.adSlots.isActive, true)))
      .orderBy(desc(schema.adSlots.priority));
  }
  return db
    .select()
    .from(schema.adSlots)
    .where(eq(schema.adSlots.isActive, true))
    .orderBy(desc(schema.adSlots.priority));
}

export async function getNewArrivals() {
  if (!db) return [];
  return db
    .select()
    .from(schema.products)
    .where(and(eq(schema.products.isNewArrival, true), eq(schema.products.isActive, true)))
    .orderBy(desc(schema.products.createdAt));
}

export async function getOccasionProducts(occasionId?: string) {
  if (!db) return [];
  if (occasionId) {
    return db
      .select()
      .from(schema.products)
      .where(and(eq(schema.products.occasionId, occasionId), eq(schema.products.isActive, true)))
      .orderBy(desc(schema.products.createdAt));
  }
  return db
    .select()
    .from(schema.products)
    .where(and(eq(schema.products.isFeatured, true), eq(schema.products.isActive, true)))
    .orderBy(desc(schema.products.createdAt));
}

export async function getBestsellers() {
  if (!db) return [];
  return db
    .select()
    .from(schema.products)
    .where(and(eq(schema.products.isBestseller, true), eq(schema.products.isActive, true)))
    .orderBy(desc(schema.products.createdAt));
}

export async function getHomepageModules() {
  if (!db) return [];
  return db
    .select()
    .from(schema.homepageModules)
    .where(eq(schema.homepageModules.isEnabled, true))
    .orderBy(schema.homepageModules.displayOrder);
}

export async function getTrustBadges() {
  if (!db) return [];
  return db
    .select()
    .from(schema.trustBadges)
    .where(eq(schema.trustBadges.isActive, true))
    .orderBy(schema.trustBadges.displayOrder);
}

export async function getAnnouncementMessages() {
  if (!db) return [];
  return db
    .select()
    .from(schema.announcementBarMessages)
    .where(eq(schema.announcementBarMessages.isActive, true))
    .orderBy(schema.announcementBarMessages.displayOrder);
}

export async function getApprovedReviews() {
  if (!db) return [];
  return db
    .select()
    .from(schema.reviews)
    .where(eq(schema.reviews.moderationStatus, 'approved'))
    .orderBy(desc(schema.reviews.rating));
}

export async function getFooterLinks() {
  if (!db) return [];
  return db
    .select()
    .from(schema.footerLinks)
    .where(eq(schema.footerLinks.isActive, true))
    .orderBy(schema.footerLinks.displayOrder);
}

export async function getSiteSettings() {
  if (!db) return [];
  return db.select().from(schema.siteSettings);
}
