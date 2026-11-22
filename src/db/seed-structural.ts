import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

async function seedStructural() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured in .env.local');
  }

  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  const adminPhone = process.env.ADMIN_PHONE || '+919999900000';
  const adminEmail = process.env.ADMIN_EMAIL || 'atelier@novuria.in';
  const adminName = process.env.ADMIN_NAME || 'Atelier Principal';

  await db
    .insert(schema.users)
    .values({
      phone: adminPhone,
      email: adminEmail,
      name: adminName,
      role: 'admin',
      isPhoneVerified: true,
    })
    .onConflictDoUpdate({
      target: schema.users.phone,
      set: {
        role: 'admin',
        name: adminName,
        email: adminEmail,
      },
    });

  const settingsData = [
    { settingKey: 'store_name', settingValue: 'Novuria Atelier', description: 'Store trading name' },
    { settingKey: 'currency', settingValue: 'INR', description: 'Store currency' },
    { settingKey: 'currency_symbol', settingValue: '₹', description: 'Currency symbol' },
    { settingKey: 'free_shipping_threshold_paise', settingValue: '500000', description: 'Free shipping threshold in paise' },
    { settingKey: 'standard_shipping_fee_paise', settingValue: '25000', description: 'Standard shipping fee in paise' },
    { settingKey: 'express_shipping_fee_paise', settingValue: '50000', description: 'Express shipping fee in paise' },
    { settingKey: 'gst_rate_apparel', settingValue: '0.12', description: 'Apparel GST rate' },
    { settingKey: 'support_phone', settingValue: '+91 800 NOVURIA', description: 'Concierge contact phone' },
    { settingKey: 'support_email', settingValue: 'concierge@novuria.in', description: 'Concierge contact email' },
  ];

  for (const s of settingsData) {
    await db
      .insert(schema.siteSettings)
      .values(s)
      .onConflictDoUpdate({
        target: schema.siteSettings.settingKey,
        set: { settingValue: s.settingValue, description: s.description },
      });
  }

  const modulesData = [
    {
      moduleKey: 'hero_slideshow',
      title: 'Hero Slideshow',
      displayOrder: 1,
      isEnabled: true,
    },
    {
      moduleKey: 'leaderboard_ad',
      title: 'Leaderboard Ad',
      displayOrder: 2,
      isEnabled: true,
    },
    {
      moduleKey: 'wardrobe_rail',
      title: 'Curated Wardrobe Rail',
      displayOrder: 3,
      isEnabled: true,
    },
    {
      moduleKey: 'verdigris_promo',
      title: 'The Verdigris Suite',
      displayOrder: 4,
      isEnabled: true,
    },
    {
      moduleKey: 'new_arrivals',
      title: 'New Arrivals Carousel',
      displayOrder: 5,
      isEnabled: true,
    },
    {
      moduleKey: 'archive_sale',
      title: 'Private Archive Sale Split Banner',
      displayOrder: 6,
      isEnabled: true,
    },
    {
      moduleKey: 'occasion_tabs',
      title: 'Shop By Occasion Tabs',
      displayOrder: 7,
      isEnabled: true,
    },
    {
      moduleKey: 'bestsellers_grid',
      title: 'Bestsellers and Complete Ensembles',
      displayOrder: 8,
      isEnabled: true,
    },
    {
      moduleKey: 'trust_bar',
      title: 'Atelier Trust and Craft Bar',
      displayOrder: 9,
      isEnabled: true,
    },
    {
      moduleKey: 'reviews_grid',
      title: 'Realised in the World Reviews',
      displayOrder: 10,
      isEnabled: true,
    },
    {
      moduleKey: 'newsletter_guild',
      title: 'Enter The Novuria Guild',
      displayOrder: 11,
      isEnabled: true,
    },
  ];

  for (const m of modulesData) {
    await db
      .insert(schema.homepageModules)
      .values(m)
      .onConflictDoUpdate({
        target: schema.homepageModules.moduleKey,
        set: {
          title: m.title,
          displayOrder: m.displayOrder,
          isEnabled: m.isEnabled,
        },
      });
  }

  const shippingData = [
    {
      name: 'Atelier Standard Delivery',
      code: 'STANDARD',
      pricePaise: 25000,
      freeThresholdPaise: 500000,
      estimatedDays: '3-5 business days',
      isActive: true,
    },
    {
      name: 'Priority White-Glove Dispatch',
      code: 'EXPRESS',
      pricePaise: 50000,
      freeThresholdPaise: 1500000,
      estimatedDays: '1-2 business days',
      isActive: true,
    },
  ];

  for (const ship of shippingData) {
    await db
      .insert(schema.shippingMethods)
      .values(ship)
      .onConflictDoUpdate({
        target: schema.shippingMethods.code,
        set: {
          name: ship.name,
          pricePaise: ship.pricePaise,
          freeThresholdPaise: ship.freeThresholdPaise,
          estimatedDays: ship.estimatedDays,
          isActive: ship.isActive,
        },
      });
  }

  const metroPincodes = [
    {
      pincode: '110001',
      city: 'New Delhi',
      state: 'Delhi',
      isServiceable: true,
      isCodAvailable: true,
      estimatedDaysMin: 2,
      estimatedDaysMax: 3,
      standardFeePaise: 25000,
      expressAvailable: true,
      expressFeePaise: 50000,
    },
    {
      pincode: '400001',
      city: 'Mumbai',
      state: 'Maharashtra',
      isServiceable: true,
      isCodAvailable: true,
      estimatedDaysMin: 2,
      estimatedDaysMax: 3,
      standardFeePaise: 25000,
      expressAvailable: true,
      expressFeePaise: 50000,
    },
    {
      pincode: '560001',
      city: 'Bengaluru',
      state: 'Karnataka',
      isServiceable: true,
      isCodAvailable: true,
      estimatedDaysMin: 2,
      estimatedDaysMax: 4,
      standardFeePaise: 25000,
      expressAvailable: true,
      expressFeePaise: 50000,
    },
    {
      pincode: '700001',
      city: 'Kolkata',
      state: 'West Bengal',
      isServiceable: true,
      isCodAvailable: true,
      estimatedDaysMin: 3,
      estimatedDaysMax: 5,
      standardFeePaise: 25000,
      expressAvailable: true,
      expressFeePaise: 50000,
    },
    {
      pincode: '600001',
      city: 'Chennai',
      state: 'Tamil Nadu',
      isServiceable: true,
      isCodAvailable: true,
      estimatedDaysMin: 3,
      estimatedDaysMax: 4,
      standardFeePaise: 25000,
      expressAvailable: true,
      expressFeePaise: 50000,
    },
    {
      pincode: '500001',
      city: 'Hyderabad',
      state: 'Telangana',
      isServiceable: true,
      isCodAvailable: true,
      estimatedDaysMin: 2,
      estimatedDaysMax: 4,
      standardFeePaise: 25000,
      expressAvailable: true,
      expressFeePaise: 50000,
    },
  ];

  for (const pin of metroPincodes) {
    await db
      .insert(schema.pincodeServiceability)
      .values(pin)
      .onConflictDoUpdate({
        target: schema.pincodeServiceability.pincode,
        set: {
          city: pin.city,
          state: pin.state,
          isServiceable: pin.isServiceable,
          isCodAvailable: pin.isCodAvailable,
          estimatedDaysMin: pin.estimatedDaysMin,
          estimatedDaysMax: pin.estimatedDaysMax,
          standardFeePaise: pin.standardFeePaise,
          expressAvailable: pin.expressAvailable,
          expressFeePaise: pin.expressFeePaise,
        },
      });
  }

  console.log('Structural seed completed: admin user, settings, modules, shipping, pincodes.');
}

seedStructural().catch((err) => {
  console.error('Structural seed error:', err);
  process.exit(1);
});
