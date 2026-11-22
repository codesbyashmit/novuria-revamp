import { boolean, integer, numeric, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { collections } from './collections';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric('compare_at_price', { precision: 10, scale: 2 }),
  inventoryCount: integer('inventory_count').default(0).notNull(),
  sku: varchar('sku', { length: 100 }),
  images: text('images').array(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  collectionId: uuid('collection_id').references(() => collections.id, { onDelete: 'set null' }),
  occasion: varchar('occasion', { length: 100 }),
  fabric: varchar('fabric', { length: 150 }),
  color: varchar('color', { length: 100 }),
  colorHex: varchar('color_hex', { length: 30 }),
  badges: text('badges').array(),
  isNewArrival: boolean('is_new_arrival').default(false).notNull(),
  isBestseller: boolean('is_bestseller').default(false).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
