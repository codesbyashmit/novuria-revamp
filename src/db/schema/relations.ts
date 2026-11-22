import { relations } from 'drizzle-orm';
import { users } from './users';
import { categories } from './categories';
import { collections } from './collections';
import { products } from './products';
import { carts, cartItems } from './carts';
import { orders, orderItems } from './orders';

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  carts: many(carts),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  collection: one(collections, {
    fields: [products.collectionId],
    references: [collections.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
