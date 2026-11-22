import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc } from 'drizzle-orm';
import { getAnnouncementMessages, getCollections, getNavCategories } from '@/lib/data';
import Header from '@/components/layout/Header';
import SwatchCard from '@/components/ui/SwatchCard';
import AtelierPrice from '@/components/ui/AtelierPrice';
import AtelierButton from '@/components/ui/AtelierButton';

export default async function CataloguePage() {
  const [announcements, navCategories, collections, products] = await Promise.all([
    getAnnouncementMessages(),
    getNavCategories(),
    getCollections(),
    db
      ? db
          .select({
            id: schema.products.id,
            name: schema.products.name,
            slug: schema.products.slug,
            description: schema.products.description,
            basePricePaise: schema.products.basePricePaise,
            compareAtPricePaise: schema.products.compareAtPricePaise,
            sku: schema.products.sku,
            badges: schema.products.badges,
          })
          .from(schema.products)
          .orderBy(desc(schema.products.createdAt))
      : Promise.resolve([]),
  ]);

  const productIds = products.map((p) => p.id);
  const imageMap: Record<string, string> = {};
  if (db && productIds.length > 0) {
    const images = await db
      .select({
        productId: schema.productImages.productId,
        imageUrl: schema.productImages.imageUrl,
      })
      .from(schema.productImages);

    images.forEach((img) => {
      if (img.productId && !imageMap[img.productId]) {
        imageMap[img.productId] = img.imageUrl;
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#FFF7FA] text-[#241726]">
      <Header
        announcement={announcements[0] || null}
        categories={navCategories}
        collections={collections}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="pb-8 mb-8 border-b border-[#1A0E1C]/15 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#7F5600] block mb-2 font-bold">
              The Sovereign Vault
            </span>
            <h1 className="font-serif text-3xl lg:text-4xl uppercase tracking-tight text-[#1A0E1C]">
              Complete Atelier Archive
            </h1>
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-[#514534]">
            {products.length} {products.length === 1 ? 'Specimen' : 'Specimens'} Inscribed
          </span>
        </div>

        {products.length === 0 ? (
          <div className="bg-white border border-[#1A0E1C]/10 p-16 text-center clip-swatch shadow-atelier-sm max-w-xl mx-auto space-y-4 relative">
            <span className="punched-hole" />
            <span className="font-mono text-xs text-[#7F5600] uppercase tracking-widest font-bold block">
              Vault Status: Inscribing
            </span>
            <h2 className="font-serif text-2xl uppercase tracking-tight text-[#1A0E1C]">
              Zero Specimens Recorded In Vault
            </h2>
            <p className="font-sans text-xs text-[#514534] max-w-sm mx-auto">
              Garments are actively being cut in the atelier. Use the Admin Panel to record product specimens or import via CSV.
            </p>
            <Link href="/admin/catalogue">
              <AtelierButton variant="primary" size="md">
                Open Atelier Catalogue Manager
              </AtelierButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((prod) => (
              <SwatchCard
                key={prod.id}
                shadow
                className="bg-white border border-[#1A0E1C]/10 flex flex-col justify-between"
              >
                <Link href={`/products/${prod.slug}`} className="block group">
                  <div className="aspect-[3/4] bg-[#F2DCF1] overflow-hidden">
                    {imageMap[prod.id] ? (
                      <img
                        src={imageMap[prod.id]}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E9D3E8]" />
                    )}
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="font-mono text-[10px] text-[#1C6960] tracking-widest uppercase block">
                      {prod.sku || 'SPECIMEN'}
                    </span>
                    <h3 className="font-serif text-base text-[#1A0E1C] group-hover:text-[#7F5600] transition-colors truncate">
                      {prod.name}
                    </h3>
                    <AtelierPrice
                      amountInPaise={prod.basePricePaise}
                      compareAtPaise={prod.compareAtPricePaise || undefined}
                    />
                  </div>
                </Link>

                <div className="p-4 pt-0">
                  <Link href={`/products/${prod.slug}`}>
                    <AtelierButton variant="secondary" size="sm" className="w-full">
                      Inspect Specimen
                    </AtelierButton>
                  </Link>
                </div>
              </SwatchCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

