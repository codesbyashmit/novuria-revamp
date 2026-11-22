import { boolean, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const pincodeServiceability = pgTable('pincode_serviceability', {
  id: uuid('id').defaultRandom().primaryKey(),
  pincode: varchar('pincode', { length: 10 }).notNull().unique(),
  city: varchar('city', { length: 150 }).notNull(),
  state: varchar('state', { length: 150 }).notNull(),
  isServiceable: boolean('is_serviceable').default(true).notNull(),
  isCodAvailable: boolean('is_cod_available').default(true).notNull(),
  estimatedDaysMin: integer('estimated_days_min').default(2).notNull(),
  estimatedDaysMax: integer('estimated_days_max').default(5).notNull(),
  standardFeePaise: integer('standard_fee_paise').default(0).notNull(),
  expressAvailable: boolean('express_available').default(false).notNull(),
  expressFeePaise: integer('express_fee_paise').default(49900).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const shippingMethods = pgTable('shipping_methods', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  pricePaise: integer('price_paise').default(0).notNull(),
  freeThresholdPaise: integer('free_threshold_paise').default(1500000).notNull(),
  estimatedDays: varchar('estimated_days', { length: 50 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

export type PincodeServiceability = typeof pincodeServiceability.$inferSelect;

