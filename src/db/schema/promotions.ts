import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const promotions = pgTable('promotions', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: varchar('type', { length: 50 }).notNull(),
  tag: varchar('tag', { length: 100 }),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  description: text('description'),
  buttonText: varchar('button_text', { length: 100 }),
  buttonLink: varchar('button_link', { length: 255 }),
  secondaryButtonText: varchar('secondary_button_text', { length: 100 }),
  secondaryButtonLink: varchar('secondary_button_link', { length: 255 }),
  imageUrl: text('image_url'),
  badgeText: varchar('badge_text', { length: 100 }),
  countdownTarget: timestamp('countdown_target', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Promotion = typeof promotions.$inferSelect;
export type NewPromotion = typeof promotions.$inferInsert;

