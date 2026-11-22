import { boolean, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { productVariants } from './catalogue';

export const searchQueries = pgTable('search_queries', {
  id: uuid('id').defaultRandom().primaryKey(),
  query: varchar('query', { length: 255 }).notNull(),
  resultCount: integer('result_count').default(0).notNull(),
  searchedAt: timestamp('searched_at', { withTimezone: true }).defaultNow().notNull(),
});

export const restockNotifications = pgTable('restock_notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }).notNull(),
  phone: varchar('phone', { length: 30 }),
  email: varchar('email', { length: 255 }),
  isNotified: boolean('is_notified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

