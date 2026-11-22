import { jsonb, numeric, integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { products } from './products';

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb('shipping_address'),
  paymentIntentId: varchar('payment_intent_id', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  quantity: integer('quantity').default(1).notNull(),
  priceAtTime: numeric('price_at_time', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
