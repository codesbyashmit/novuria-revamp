import { relations } from 'drizzle-orm';
import { users, sessions, addresses } from './auth';
import {
  categories,
  collections,
  occasions,
  fabrics,
  products,
  productVariants,
  productImages,
  sizeCharts,
} from './catalogue';
import { inventory, inventoryAuditLogs } from './inventory';
import { carts, cartItems, wishlists, wishlistItems } from './cartWishlist';
import { orders, orderItems, orderStatusHistory, payments, refunds, returnsExchanges, invoices } from './orders';
import { coupons, offerRedemptions } from './coupons';
import { reviews, reviewPhotos, productQuestions } from './reviews';

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  addresses: many(addresses),
  orders: many(orders),
  carts: many(carts),
  wishlists: many(wishlists),
  reviews: many(reviews),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'category_hierarchy',
  }),
  children: many(categories, {
    relationName: 'category_hierarchy',
  }),
  products: many(products),
  sizeCharts: many(sizeCharts),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  products: many(products),
}));

export const occasionsRelations = relations(occasions, ({ many }) => ({
  products: many(products),
}));

export const fabricsRelations = relations(fabrics, ({ many }) => ({
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
  occasion: one(occasions, {
    fields: [products.occasionId],
    references: [occasions.id],
  }),
  fabric: one(fabrics, {
    fields: [products.fabricId],
    references: [fabrics.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  reviews: many(reviews),
  questions: many(productQuestions),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  inventory: one(inventory, {
    fields: [productVariants.id],
    references: [inventory.variantId],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  auditLogs: many(inventoryAuditLogs),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  variant: one(productVariants, {
    fields: [inventory.variantId],
    references: [productVariants.id],
  }),
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
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  items: many(wishlistItems),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  wishlist: one(wishlists, {
    fields: [wishlistItems.wishlistId],
    references: [wishlists.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  payments: many(payments),
  refunds: many(refunds),
  returns: many(returnsExchanges),
  invoices: many(invoices),
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
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const couponsRelations = relations(coupons, ({ many }) => ({
  redemptions: many(offerRedemptions),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  photos: many(reviewPhotos),
}));
