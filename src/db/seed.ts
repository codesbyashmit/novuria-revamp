import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set in environment.');
    process.exit(1);
  }

  console.log('Beginning database seed.');
  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  const categoriesData = [
    { name: 'NEW IN', slug: 'new-in', isNav: true, displayOrder: 1 },
    { name: 'SAREES', slug: 'sarees', isNav: true, displayOrder: 2 },
    { name: 'SUITS', slug: 'suits', isNav: true, displayOrder: 3 },
    { name: 'LEHENGAS', slug: 'lehengas', isNav: true, displayOrder: 4 },
    { name: 'KURTA SETS', slug: 'kurta-sets', isNav: true, displayOrder: 5 },
    { name: 'WESTERN', slug: 'western', isNav: true, displayOrder: 6 },
    { name: 'CO-ORD SETS', slug: 'co-ord-sets', isNav: true, displayOrder: 7 },
    { name: 'JEWELLERY', slug: 'jewellery', isNav: true, displayOrder: 8 },
    { name: 'SALE', slug: 'sale', isNav: true, displayOrder: 9 },
  ];

  for (const cat of categoriesData) {
    await db
      .insert(schema.categories)
      .values(cat)
      .onConflictDoUpdate({
        target: schema.categories.slug,
        set: { name: cat.name, isNav: cat.isNav, displayOrder: cat.displayOrder },
      });
  }
  console.log('Categories seeded.');

  const allCategories = await db.select().from(schema.categories);
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

  const collectionsData = [
    {
      title: 'Raw Silk',
      slug: 'raw-silk',
      subtitle: 'Pure Handloom',
      itemCountText: '24 items',
      displayOrder: 1,
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Tissue Organza',
      slug: 'tissue-organza',
      subtitle: 'Lustrous Drape',
      itemCountText: '18 items',
      displayOrder: 2,
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Pure Silk Sarees',
      slug: 'pure-silk-sarees',
      subtitle: 'Zari Bordered',
      itemCountText: '36 items',
      displayOrder: 3,
      imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Handspun Kurta Sets',
      slug: 'handspun-kurta-sets',
      subtitle: 'Tailored Ease',
      itemCountText: '29 items',
      displayOrder: 4,
      imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Banarasi Zari Dupattas',
      slug: 'banarasi-zari-dupattas',
      subtitle: 'Royal Heritage',
      itemCountText: '15 items',
      displayOrder: 5,
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Bandhani Weaves',
      slug: 'bandhani-weaves',
      subtitle: 'Artisanal Tie-Dye',
      itemCountText: '22 items',
      displayOrder: 6,
      imageUrl: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const col of collectionsData) {
    await db
      .insert(schema.collections)
      .values(col)
      .onConflictDoUpdate({
        target: schema.collections.slug,
        set: {
          title: col.title,
          subtitle: col.subtitle,
          itemCountText: col.itemCountText,
          imageUrl: col.imageUrl,
          displayOrder: col.displayOrder,
        },
      });
  }
  console.log('Collections seeded.');

  const allCollections = await db.select().from(schema.collections);
  const collectionMap = new Map(allCollections.map((c) => [c.slug, c.id]));

  const promotionsData = [
    {
      type: 'announcement',
      title: 'FREE EXPRESS SHIPPING ON ORDERS ABOVE 15000 INR | COMPLIMENTARY GIFT WRAP ON ALL ORDERS',
      buttonText: 'DETAILS',
      buttonLink: '/shipping',
      isActive: true,
    },
    {
      type: 'hero',
      tag: 'AUTUMN / WINTER // SOVEREIGN',
      title: 'SOVEREIGN SILKS & raw modern tailoring',
      subtitle: 'Handspun Chanderi coats, tissue silk lehengas aged metallic zari, sharp cord sets, and royal vestures',
      buttonText: 'EXPLORE AUTUMN RUNWAY',
      buttonLink: '/collections/raw-silk',
      secondaryButtonText: 'VIEW CAMPAIGN FILM',
      secondaryButtonLink: '/campaign',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80',
      isActive: true,
    },
    {
      type: 'golden_club',
      tag: 'GOLDEN COUTURE CLUB',
      title: 'Complimentary personal concierge styling & 15% cashback credits on orders over 25000 INR.',
      buttonText: 'ENTER PRIVATE SALON',
      buttonLink: '/salon',
      secondaryButtonText: 'EXPLORE PRIVILEGES',
      secondaryButtonLink: '/membership',
      isActive: true,
    },
    {
      type: 'atelier_highlight',
      tag: 'ATELIER HIGHLIGHT // EXCLUSIVE',
      title: 'THE VERDIGRIS SUITE',
      description: 'Dense zardozi embroidery with satin corded threadwork. Handspun kurta, regal palazzo, and custom hand-screened tissue organza dupatta.',
      buttonText: 'VIEW BESPOKE SUITE',
      buttonLink: '/products/tiered-capsule-aarkash-ensemble',
      isActive: true,
    },
    {
      type: 'bespoke_highlight',
      tag: 'CURATED BESPOKE',
      title: 'Novuria x Agate Gem Grid',
      description: 'Limited edition natural mineral gems embedded on raw dupion silk bands.',
      buttonText: 'REQUEST COMMISSION',
      buttonLink: '/bespoke',
      isActive: true,
    },
    {
      type: 'archive_sale',
      tag: 'VIP ACCESS EXCLUSIVE',
      title: 'Private Archive Sale',
      subtitle: 'Up to 30% private privileges on selected archival runway editions and limited-piece restocks.',
      buttonText: 'SHOP PRIVATE ARCHIVE',
      buttonLink: '/archive-sale',
      secondaryButtonText: 'VIEW CATALOGUE PREVIEW',
      secondaryButtonLink: '/catalog',
      countdownTarget: new Date(Date.now() + 1000 * 60 * 60 * 114),
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      isActive: true,
    },
  ];

  await db.delete(schema.promotions);
  for (const promo of promotionsData) {
    await db.insert(schema.promotions).values(promo);
  }
  console.log('Promotions seeded.');

  const productsData = [
    {
      name: 'Tiered Capsule Aarkash Ensemble',
      slug: 'tiered-capsule-aarkash-ensemble',
      description: 'Layered ensemble with silk-threaded floral crests, wide-cuff trousers, and sheer organza overlay.',
      price: '31500.00',
      compareAtPrice: '38000.00',
      inventoryCount: 15,
      sku: 'NOV-AARKASH-01',
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('suits'),
      collectionId: collectionMap.get('raw-silk'),
      occasion: 'reception',
      fabric: 'Mulberry Silk & Zari',
      color: 'Emerald Verdigris',
      colorHex: '#2a5c4d',
      badges: ['ATELIER EDIT', 'LIMITED'],
      isFeatured: true,
      isNewArrival: false,
      isBestseller: false,
      isActive: true,
    },
    {
      name: 'Spring Jade Georgette Jumpsuit',
      slug: 'spring-jade-georgette-jumpsuit',
      description: 'Pleated georgette tailored jumpsuit with metallic thread embroidered collar and sash belt.',
      price: '24500.00',
      compareAtPrice: '29000.00',
      inventoryCount: 20,
      sku: 'NOV-JADE-02',
      images: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('western'),
      collectionId: collectionMap.get('tissue-organza'),
      occasion: 'sangeet',
      fabric: 'Crinkled Silk Georgette',
      color: 'Spring Jade',
      colorHex: '#3b7a67',
      badges: ['NEW IN', 'RUNWAY EDIT'],
      isFeatured: true,
      isNewArrival: true,
      isBestseller: false,
      isActive: true,
    },
    {
      name: 'Saffron Marodi Tailored Jacket',
      slug: 'saffron-marodi-tailored-jacket',
      description: 'Short silhouette dupion silk jacket detailed with traditional marodi metallic embroidery.',
      price: '18900.00',
      compareAtPrice: '22500.00',
      inventoryCount: 30,
      sku: 'NOV-SAFFRON-03',
      images: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('western'),
      collectionId: collectionMap.get('raw-silk'),
      occasion: 'festival',
      fabric: 'Raw Dupion Silk',
      color: 'Warm Saffron',
      colorHex: '#d97736',
      badges: ['NEW IN'],
      isFeatured: false,
      isNewArrival: true,
      isBestseller: false,
      isActive: true,
    },
    {
      name: 'Plum Aubergine Flared Sharara Set',
      slug: 'plum-aubergine-flared-sharara-set',
      description: 'Three-piece flared sharara set in royal aubergine silk georgette with zari handiwork.',
      price: '34000.00',
      compareAtPrice: '39500.00',
      inventoryCount: 12,
      sku: 'NOV-PLUM-04',
      images: [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('kurta-sets'),
      collectionId: collectionMap.get('handspun-kurta-sets'),
      occasion: 'bridal',
      fabric: 'Silk Georgette',
      color: 'Deep Plum',
      colorHex: '#4a2545',
      badges: ['EXCLUSIVE'],
      isFeatured: true,
      isNewArrival: true,
      isBestseller: false,
      isActive: true,
    },
    {
      name: 'Terracotta Raw Silk Kurta Ensemble',
      slug: 'terracotta-raw-silk-kurta-ensemble',
      description: 'Structured longline kurta with tonal stitch accents and handspun linen-silk cigarette trousers.',
      price: '21500.00',
      compareAtPrice: '25000.00',
      inventoryCount: 25,
      sku: 'NOV-TERRA-05',
      images: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('kurta-sets'),
      collectionId: collectionMap.get('raw-silk'),
      occasion: 'festival',
      fabric: 'Matka Raw Silk',
      color: 'Terracotta Rust',
      colorHex: '#a85038',
      badges: ['RUNWAY EDIT'],
      isFeatured: false,
      isNewArrival: true,
      isBestseller: false,
      isActive: true,
    },
    {
      name: 'Asymmetric Lapel Tuxedo Set',
      slug: 'asymmetric-lapel-tuxedo-set',
      description: 'High-couture asymmetric tailored tuxedo jacket with straight drape trousers.',
      price: '27000.00',
      compareAtPrice: null,
      inventoryCount: 18,
      sku: 'NOV-TUX-06',
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('western'),
      collectionId: collectionMap.get('raw-silk'),
      occasion: 'red-carpet',
      fabric: 'Italian Crepe and Silk',
      color: 'Midnight Charcoal',
      colorHex: '#1e242b',
      badges: ['BESPOKE'],
      isFeatured: true,
      isNewArrival: false,
      isBestseller: false,
      isActive: true,
    },
    {
      name: 'Olive Handspun Tunic Ensemble',
      slug: 'olive-handspun-tunic-ensemble',
      description: 'Monochromatic relaxed tunic outfit crafted from hand-spun Chanderi fabric with slit cuffs.',
      price: '19500.00',
      compareAtPrice: null,
      inventoryCount: 22,
      sku: 'NOV-OLIVE-07',
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('co-ord-sets'),
      collectionId: collectionMap.get('handspun-kurta-sets'),
      occasion: 'sangeet',
      fabric: 'Chanderi Weave',
      color: 'Moss Olive',
      colorHex: '#526046',
      badges: ['NEW ARRIVAL'],
      isFeatured: true,
      isNewArrival: false,
      isBestseller: false,
      isActive: true,
    },
    {
      name: 'Pleated Wide-Leg Trouser',
      slug: 'pleated-wide-leg-trouser',
      description: 'High-waisted tailored pleated trousers with lustrous textured sheen.',
      price: '13500.00',
      compareAtPrice: null,
      inventoryCount: 30,
      sku: 'NOV-TROUSER-08',
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('western'),
      collectionId: collectionMap.get('tissue-organza'),
      occasion: 'festival',
      fabric: 'Textured Linen Silk',
      color: 'Sand Gold',
      colorHex: '#c8b28a',
      badges: [],
      isFeatured: false,
      isNewArrival: false,
      isBestseller: false,
      isActive: true,
    },
    {
      name: 'Draped Structured Kimono Set',
      slug: 'draped-structured-kimono-set',
      description: 'Architectural kimono crossover collar coordinate set with tapered pant.',
      price: '24000.00',
      compareAtPrice: null,
      inventoryCount: 16,
      sku: 'NOV-KIMONO-09',
      images: [
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('co-ord-sets'),
      collectionId: collectionMap.get('raw-silk'),
      occasion: 'red-carpet',
      fabric: 'Crepe de Chine',
      color: 'Royal Sapphire',
      colorHex: '#193563',
      badges: ['EXCLUSIVE'],
      isFeatured: true,
      isNewArrival: false,
      isBestseller: false,
      isActive: true,
    },
    {
      name: 'Royal Sapphire Banarasi Saree',
      slug: 'royal-sapphire-banarasi-saree',
      description: 'Heritage hand-woven Banarasi silk saree with aged antique gold zari kadhwa borders.',
      price: '42000.00',
      compareAtPrice: '48000.00',
      inventoryCount: 10,
      sku: 'NOV-SAREE-10',
      images: [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('sarees'),
      collectionId: collectionMap.get('pure-silk-sarees'),
      occasion: 'bridal',
      fabric: 'Katan Silk Zari',
      color: 'Royal Sapphire',
      colorHex: '#122a59',
      badges: ['BESTSELLER', 'HERITAGE'],
      isFeatured: true,
      isNewArrival: false,
      isBestseller: true,
      isActive: true,
    },
    {
      name: 'Chanderi Angrakha Frock',
      slug: 'chanderi-angrakha-frock',
      description: 'Traditional angrakha cut flared kurta with delicate gotapatti edging and hand-blocked dupatta.',
      price: '18500.00',
      compareAtPrice: null,
      inventoryCount: 25,
      sku: 'NOV-ANGRAKHA-11',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('kurta-sets'),
      collectionId: collectionMap.get('handspun-kurta-sets'),
      occasion: 'festival',
      fabric: 'Handspun Chanderi',
      color: 'Forest Emerald',
      colorHex: '#1d4738',
      badges: ['BESTSELLER'],
      isFeatured: false,
      isNewArrival: false,
      isBestseller: true,
      isActive: true,
    },
    {
      name: 'Kesari Handloom Anarkali Suit',
      slug: 'kesari-handloom-anarkali-suit',
      description: 'Opulent mustard saffron Kalidar anarkali with fine resham embroidery and chudidar trousers.',
      price: '29000.00',
      compareAtPrice: null,
      inventoryCount: 14,
      sku: 'NOV-KESARI-12',
      images: [
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
      ],
      categoryId: categoryMap.get('suits'),
      collectionId: collectionMap.get('pure-silk-sarees'),
      occasion: 'sangeet',
      fabric: 'Mulberry Silk',
      color: 'Haldi Ochre',
      colorHex: '#cc9428',
      badges: ['BESTSELLER'],
      isFeatured: true,
      isNewArrival: false,
      isBestseller: true,
      isActive: true,
    },
  ];

  for (const prod of productsData) {
    await db
      .insert(schema.products)
      .values(prod)
      .onConflictDoUpdate({
        target: schema.products.slug,
        set: {
          name: prod.name,
          description: prod.description,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          images: prod.images,
          categoryId: prod.categoryId,
          collectionId: prod.collectionId,
          occasion: prod.occasion,
          fabric: prod.fabric,
          color: prod.color,
          colorHex: prod.colorHex,
          badges: prod.badges,
          isNewArrival: prod.isNewArrival,
          isBestseller: prod.isBestseller,
          isFeatured: prod.isFeatured,
        },
      });
  }
  console.log('Products seeded.');

  const bundleData = {
    name: 'Complete Sovereign Ensemble',
    slug: 'complete-sovereign-ensemble',
    subtitle: 'Curated 3-Piece Atelier Look',
    totalPrice: '72500.00',
    compareAtPrice: '84500.00',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80',
    piecesJson: [
      { name: 'Handspun Zardozi Coat', price: '34,000 INR' },
      { name: 'Tissue Organza Slip & Palazzo', price: '22,500 INR' },
      { name: 'Aged Metallic Zari Stole', price: '16,000 INR' },
    ],
  };

  await db
    .insert(schema.bundles)
    .values(bundleData)
    .onConflictDoUpdate({
      target: schema.bundles.slug,
      set: bundleData,
    });
  console.log('Bundles seeded.');

  const storiesData = [
    {
      personName: 'Aastha Sharma',
      city: 'Mumbai Gala',
      quote: 'The structure and hand-loomed feel of the verdigris suit commanded the whole room. Impeccable tailoring.',
      rating: 5,
      outfitTitle: 'Verdigris Tailored Jumpsuit',
      productSlug: 'spring-jade-georgette-jumpsuit',
      displayOrder: 1,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    {
      personName: 'Rhea Pillai',
      city: 'New Delhi Wedding',
      quote: 'The Banarasi saree drapes like liquid metal. The weight and craftsmanship were unmistakably authentic.',
      rating: 5,
      outfitTitle: 'Royal Sapphire Banarasi Saree',
      productSlug: 'royal-sapphire-banarasi-saree',
      displayOrder: 2,
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    },
    {
      personName: 'Meera Sen',
      city: 'London Reception',
      quote: 'Custom sizing was accurate down to the millimeter. Delivered to Mayfair in pristine condition.',
      rating: 5,
      outfitTitle: 'Plum Aubergine Flared Sharara',
      productSlug: 'plum-aubergine-flared-sharara-set',
      displayOrder: 3,
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    },
    {
      personName: 'Dr. Alisha Kapur',
      city: 'Dubai Red Carpet',
      quote: 'The modern cuts fused with traditional zardozi make Novuria my go-to for all global gala appearances.',
      rating: 5,
      outfitTitle: 'Asymmetric Lapel Tuxedo Set',
      productSlug: 'asymmetric-lapel-tuxedo-set',
      displayOrder: 4,
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    },
  ];

  await db.delete(schema.lookbookStories);
  for (const story of storiesData) {
    await db.insert(schema.lookbookStories).values(story);
  }
  console.log('Lookbook stories seeded.');

  console.log('Database seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
