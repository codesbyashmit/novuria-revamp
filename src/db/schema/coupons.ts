import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const coupons = pgTable('coupons', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  discountType: varchar('discount_type', { length: 20 }).default('percentage').notNull(),
  discountValue: integer('discount_value').notNull(),
  minSpendPaise: integer('min_spend_paise').default(0).notNull(),
  maxDiscountPaise: integer('max_discount_paise'),
  usageLimitPerUser: integer('usage_limit_per_user').default(1).notNull(),
  totalUsageLimit: integer('total_usage_limit'),
  timesUsed: integer('times_used').default(0).notNull(),
  firstOrderOnly: boolean('first_order_only').default(false).notNull(),
  validFrom: timestamp('valid_from', { withTimezone: true }).defaultNow().notNull(),
  validUntil: timestamp('valid_until', { withTimezone: true }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const offerRedemptions = pgTable('offer_redemptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  couponId: uuid('coupon_id').references(() => coupons.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  orderId: uuid('order_id').notNull(),
  discountAmountPaise: integer('discount_amount_paise').notNull(),
  redeemedAt: timestamp('redeemed_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Coupon = typeof coupons.$inferSelect;
export type OfferRedemption = typeof offerRedemptions.$inferSelect;
