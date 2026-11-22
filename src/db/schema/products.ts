import { boolean, integer, numeric, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { categories } from './categories';

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
  isFeatured: boolean('is_featured').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
