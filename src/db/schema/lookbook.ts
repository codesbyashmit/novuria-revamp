import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const lookbookStories = pgTable('lookbook_stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  personName: varchar('person_name', { length: 255 }).notNull(),
  city: varchar('city', { length: 255 }).notNull(),
  quote: text('quote').notNull(),
  rating: integer('rating').default(5).notNull(),
  imageUrl: text('image_url').notNull(),
  outfitTitle: varchar('outfit_title', { length: 255 }).notNull(),
  productSlug: varchar('product_slug', { length: 255 }),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type LookbookStory = typeof lookbookStories.$inferSelect;
export type NewLookbookStory = typeof lookbookStories.$inferInsert;

