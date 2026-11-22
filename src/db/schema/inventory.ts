import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { productVariants } from './catalogue';

export const inventory = pgTable('inventory', {
  id: uuid('id').defaultRandom().primaryKey(),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }).notNull().unique(),
  quantityOnHand: integer('quantity_on_hand').default(0).notNull(),
  reservedQuantity: integer('reserved_quantity').default(0).notNull(),
  reorderThreshold: integer('reorder_threshold').default(5).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const inventoryAuditLogs = pgTable('inventory_audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }).notNull(),
  orderId: uuid('order_id'),
  changeQuantity: integer('change_quantity').notNull(),
  balanceAfter: integer('balance_after').notNull(),
  reason: varchar('reason', { length: 100 }).notNull(),
  createdById: uuid('created_by_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Inventory = typeof inventory.$inferSelect;
export type InventoryAuditLog = typeof inventoryAuditLogs.$inferSelect;

