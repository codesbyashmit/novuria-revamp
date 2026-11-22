import { integer, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './auth';
import { products, productVariants } from './catalogue';

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  guestEmail: varchar('guest_email', { length: 255 }),
  guestPhone: varchar('guest_phone', { length: 30 }),
  status: varchar('status', { length: 50 }).default('placed').notNull(),
  subtotalPaise: integer('subtotal_paise').notNull(),
  discountPaise: integer('discount_paise').default(0).notNull(),
  shippingPaise: integer('shipping_paise').default(0).notNull(),
  taxPaise: integer('tax_paise').default(0).notNull(),
  totalAmountPaise: integer('total_amount_paise').notNull(),
  shippingAddressSnapshot: jsonb('shipping_address_snapshot').notNull(),
  billingAddressSnapshot: jsonb('billing_address_snapshot'),
  paymentMethod: varchar('payment_method', { length: 50 }).default('razorpay').notNull(),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending').notNull(),
  trackingNumber: varchar('tracking_number', { length: 100 }),
  courierName: varchar('courier_name', { length: 100 }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),
  titleSnapshot: varchar('title_snapshot', { length: 255 }).notNull(),
  skuSnapshot: varchar('sku_snapshot', { length: 100 }).notNull(),
  colorSnapshot: varchar('color_snapshot', { length: 100 }),
  sizeSnapshot: varchar('size_snapshot', { length: 50 }),
  imageSnapshot: text('image_snapshot'),
  pricePaiseSnapshot: integer('price_paise_snapshot').notNull(),
  quantity: integer('quantity').notNull(),
  subtotalPaise: integer('subtotal_paise').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orderStatusHistory = pgTable('order_status_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  fromStatus: varchar('from_status', { length: 50 }),
  toStatus: varchar('to_status', { length: 50 }).notNull(),
  comment: text('comment'),
  updatedById: uuid('updated_by_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  gateway: varchar('gateway', { length: 50 }).default('razorpay').notNull(),
  gatewayOrderId: varchar('gateway_order_id', { length: 100 }),
  gatewayPaymentId: varchar('gateway_payment_id', { length: 100 }),
  gatewaySignature: varchar('gateway_signature', { length: 255 }),
  amountPaise: integer('amount_paise').notNull(),
  currency: varchar('currency', { length: 10 }).default('INR').notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  payloadJson: jsonb('payload_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const refunds = pgTable('refunds', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'cascade' }).notNull(),
  amountPaise: integer('amount_paise').notNull(),
  reason: text('reason').notNull(),
  gatewayRefundId: varchar('gateway_refund_id', { length: 100 }),
  status: varchar('status', { length: 50 }).default('processed').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const returnsExchanges = pgTable('returns_exchanges', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  orderItemId: uuid('order_item_id').references(() => orderItems.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 30 }).default('return').notNull(),
  reason: text('reason').notNull(),
  status: varchar('status', { length: 50 }).default('requested').notNull(),
  pickupTracking: varchar('pickup_tracking', { length: 100 }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  invoiceNumber: varchar('invoice_number', { length: 100 }).notNull().unique(),
  pdfUrl: text('pdf_url'),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Payment = typeof payments.$inferSelect;
