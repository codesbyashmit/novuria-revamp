import { boolean, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const homepageModules = pgTable('homepage_modules', {
  id: uuid('id').defaultRandom().primaryKey(),
  moduleKey: varchar('module_key', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  isEnabled: boolean('is_enabled').default(true).notNull(),
  scheduledStart: timestamp('scheduled_start', { withTimezone: true }),
  scheduledEnd: timestamp('scheduled_end', { withTimezone: true }),
  configJson: jsonb('config_json'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const heroSlides = pgTable('hero_slides', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  italicAccent: varchar('italic_accent', { length: 255 }),
  eyebrowTag: varchar('eyebrow_tag', { length: 150 }),
  imageUrl: text('image_url').notNull(),
  mobileImageUrl: text('mobile_image_url'),
  ctaText: varchar('cta_text', { length: 100 }),
  ctaLink: varchar('cta_link', { length: 255 }),
  secondaryCtaText: varchar('secondary_cta_text', { length: 100 }),
  secondaryCtaLink: varchar('secondary_cta_link', { length: 255 }),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const adSlots = pgTable('ad_slots', {
  id: uuid('id').defaultRandom().primaryKey(),
  slotKey: varchar('slot_key', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  badge: varchar('badge', { length: 100 }),
  code: varchar('code', { length: 50 }),
  imageUrl: text('image_url'),
  linkUrl: varchar('link_url', { length: 255 }),
  buttonText: varchar('button_text', { length: 100 }),
  priority: integer('priority').default(1).notNull(),
  deviceTarget: varchar('device_target', { length: 20 }).default('all').notNull(),
  impressionsCount: integer('impressions_count').default(0).notNull(),
  clicksCount: integer('clicks_count').default(0).notNull(),
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const announcementBarMessages = pgTable('announcement_bar_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  messageText: text('message_text').notNull(),
  linkText: varchar('link_text', { length: 100 }),
  linkUrl: varchar('link_url', { length: 255 }),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const footerLinks = pgTable('footer_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  columnKey: varchar('column_key', { length: 50 }).notNull(),
  label: varchar('label', { length: 150 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

export const trustBadges = pgTable('trust_badges', {
  id: uuid('id').defaultRandom().primaryKey(),
  iconName: varchar('icon_name', { length: 50 }).notNull(),
  title: varchar('title', { length: 150 }).notNull(),
  subtitle: text('subtitle').notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

export const siteSettings = pgTable('site_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  settingKey: varchar('setting_key', { length: 100 }).notNull().unique(),
  settingValue: text('setting_value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type HomepageModule = typeof homepageModules.$inferSelect;
export type HeroSlide = typeof heroSlides.$inferSelect;
export type AdSlot = typeof adSlots.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
