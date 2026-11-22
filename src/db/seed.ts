import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: DATABASE_URL is not set in .env.local or environment.');
    process.exit(1);
  }

  console.log('Starting database seeding with sample e-commerce data...');
  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  console.log('Seeding categories...');
  const insertedCategories = await db
    .insert(schema.categories)
    .values([
      {
        name: 'Electronics & Audio',
        slug: 'electronics-audio',
        description: 'Premium headphones, audio equipment, and smart accessories.',
      },
      {
        name: 'Apparel & Streetwear',
        slug: 'apparel-streetwear',
        description: 'Modern minimalist streetwear and luxury essentials.',
      },
      {
        name: 'Home & Workspace',
        slug: 'home-workspace',
        description: 'Curated ergonomic furniture and desk setups.',
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`Inserted ${insertedCategories.length} categories`);

  if (insertedCategories.length > 0) {
    const electronicsId = insertedCategories.find((c) => c.slug === 'electronics-audio')?.id;
    const apparelId = insertedCategories.find((c) => c.slug === 'apparel-streetwear')?.id;
    const homeId = insertedCategories.find((c) => c.slug === 'home-workspace')?.id;

    console.log('Seeding products...');
    const insertedProducts = await db
      .insert(schema.products)
      .values([
        {
          name: 'Novuria ANC Wireless Headphones',
          slug: 'novuria-anc-wireless-headphones',
          description: 'Studio-grade noise cancelling headphones with 40h battery life and spatial audio.',
          price: '249.99',
          compareAtPrice: '299.99',
          inventoryCount: 45,
          sku: 'NOV-AUDIO-001',
          categoryId: electronicsId,
          isFeatured: true,
          isActive: true,
        },
        {
          name: 'Heavyweight Oversized Hoodie',
          slug: 'heavyweight-oversized-hoodie',
          description: '450 GSM French Terry cotton oversized hoodie with embroidered logo.',
          price: '89.00',
          compareAtPrice: '110.00',
          inventoryCount: 80,
          sku: 'NOV-APP-001',
          categoryId: apparelId,
          isFeatured: true,
          isActive: true,
        },
        {
          name: 'Solid Walnut Desk Shelf',
          slug: 'solid-walnut-desk-shelf',
          description: 'Handcrafted solid American walnut monitor riser with aluminum legs.',
          price: '135.00',
          inventoryCount: 25,
          sku: 'NOV-HOME-001',
          categoryId: homeId,
          isFeatured: true,
          isActive: true,
        },
      ])
      .onConflictDoNothing()
      .returning();

    console.log(`Inserted ${insertedProducts.length} products`);
  }

  console.log('Seeding completed successfully.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
