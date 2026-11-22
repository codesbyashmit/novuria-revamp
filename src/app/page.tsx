import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import * as schema from '@/db/schema';
import {
  getAdSlots,
  getAnnouncementMessages,
  getApprovedReviews,
  getCollections,
  getHeroSlides,
  getHomepageModules,
  getNavCategories,
  getNewArrivals,
} from '@/lib/data';
import Header from '@/components/layout/Header';
import SwatchCard from '@/components/ui/SwatchCard';
import AtelierPrice from '@/components/ui/AtelierPrice';
import AtelierButton from '@/components/ui/AtelierButton';
import GuildNewsletter from '@/components/landing/GuildNewsletter';
import { ArrowRight, ChevronRight, RotateCcw, Scissors, ShieldCheck, Star, Truck } from 'lucide-react';

export default async function HomePage() {
  const [
    announcements,
    navCategories,
    collections,
    heroSlides,
    adSlots,
    newArrivals,
    modules,
    reviews,
  ] = await Promise.all([
    getAnnouncementMessages(),
    getNavCategories(),
    getCollections(),
    getHeroSlides(),
    getAdSlots(),
    getNewArrivals(),
    getHomepageModules(),
    getApprovedReviews(),
  ]);

  const announcement = announcements[0] || null;
  const primaryHero = heroSlides[0] || null;
  const leaderboardAd = adSlots.find((a) => a.slotKey === 'leaderboard');
  const verdigrisAd = adSlots.find((a) => a.slotKey === 'verdigris_suite');
  const archiveSaleAd = adSlots.find((a) => a.slotKey === 'archive_sale');

  const productIds = newArrivals.map((p) => p.id);
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

  const enabledKeys = new Set(modules.map((m) => m.moduleKey));

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF7FA] text-[#241726]">
      <Header
        announcement={announcement}
        categories={navCategories}
        collections={collections}
      />

      <main className="flex-1 flex flex-col">
        {enabledKeys.has('hero_slideshow') && (
          <section className="relative w-full min-h-[580px] bg-[#1A0E1C] overflow-hidden flex flex-col justify-end">
            {primaryHero?.imageUrl && (
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={primaryHero.imageUrl}
                  alt={primaryHero.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E1C]/90 via-[#1A0E1C]/35 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E1C]/75 via-transparent to-[#1A0E1C]/30" />
              </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto w-full px-4 lg:px-8 pb-12 pt-28">
              <div className="max-w-2xl bg-[#1A0E1C]/90 backdrop-blur-md text-[#FFF7FA] p-8 border-l-4 border-[#E6A117] clip-swatch shadow-2xl relative">
                <span className="punched-hole" />

                <div className="flex items-center gap-2 pb-2">
                  <span className="w-2 h-2 rounded-full bg-[#E6A117] animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#E5B869] font-bold">
                    {primaryHero?.eyebrowTag || 'Autumn / Winter 26 Atelier'}
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl text-[#FFF7FA] leading-tight uppercase font-normal mt-1 mb-3">
                  {primaryHero ? primaryHero.title : 'SOVEREIGN SILKS'}{' '}
                  <span className="italic font-normal text-[#E5B869]">
                    {primaryHero?.italicAccent || '& raw modern tailoring'}
                  </span>
                </h1>

                <p className="font-sans text-xs sm:text-sm text-[#FFF7FA]/80 max-w-lg mb-6 leading-relaxed">
                  {primaryHero?.subtitle ||
                    'Sculpted drape meets ceremonial brocade in aged sandalwood, deep verdigris, and royal saffron.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#FFF7FA]/15">
                  <div className="flex items-center gap-4">
                    {primaryHero?.ctaLink && primaryHero?.ctaText && (
                      <Link href={primaryHero.ctaLink}>
                        <AtelierButton variant="primary" size="md">
                          {primaryHero.ctaText}
                        </AtelierButton>
                      </Link>
                    )}
                  </div>

                  <span className="font-mono text-xs text-[#FFF7FA]/60">01 / 04</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {enabledKeys.has('leaderboard_ad') && leaderboardAd && (
          <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 -mt-6 relative z-20">
            <div className="bg-[#1A0E1C] text-[#FFF7FA] p-4 sm:p-5 clip-swatch shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border-t-2 border-[#E6A117] relative">
              <span className="punched-hole" />

              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#E6A117] text-[#1A0E1C] shrink-0 clip-swatch-sm">
                  <ShieldCheck className="w-5 h-5 text-[#1A0E1C]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#E5B869] font-bold">
                      Exclusive Privilege
                    </span>
                    <span className="opacity-40">•</span>
                    <span className="font-mono text-[10px] text-[#FFF7FA]/70 tracking-wider">
                      SBI Aurum &amp; AMEX Centurion
                    </span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[#FFF7FA] mt-0.5">
                    {leaderboardAd.subtitle ||
                      'Complimentary personal concierge styling & 10% statement credit on acquisitions over ₹25,000.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
                <div className="px-3 py-1.5 bg-[#FFF7FA]/10 text-[#E5B869] font-mono text-xs uppercase tracking-wider">
                  CODE: <span className="text-white font-bold">PRIVILEGE26</span>
                </div>
                {leaderboardAd.linkUrl && (
                  <Link href={leaderboardAd.linkUrl}>
                    <AtelierButton variant="primary" size="sm">
                      {leaderboardAd.buttonText || 'Claim Offer'}
                    </AtelierButton>
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {enabledKeys.has('wardrobe_rail') && (
          <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-10">
            <div className="flex items-end justify-between mb-6 pb-2 border-b border-[#1A0E1C]/15">
              <div>
                <span className="font-mono text-xs uppercase text-[#7F5600] tracking-widest font-bold block mb-1">
                  Swatch Portfolio
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl text-[#1A0E1C] uppercase tracking-tight">
                  Curated Wardrobe Rails
                </h2>
              </div>
              <Link
                href="/catalogue"
                className="font-mono text-xs text-[#7F5600] uppercase tracking-wider hover:underline flex items-center gap-1 font-bold"
              >
                <span>View All Rails</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {collections.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth">
                {collections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collection/${col.slug}`}
                    className="group min-w-[240px] max-w-[280px] flex flex-col bg-white border border-[#1A0E1C]/10 clip-swatch shadow-atelier-sm hover:border-[#E6A117] transition-all relative shrink-0 snap-start"
                  >
                    <span className="punched-hole" />
                    <div className="relative h-36 w-full overflow-hidden bg-[#F2DCF1]">
                      {col.imageUrl ? (
                        <img
                          src={col.imageUrl}
                          alt={col.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#E9D3E8]" />
                      )}
                      {col.itemCountText && (
                        <span className="absolute bottom-2 left-2 bg-[#1A0E1C]/85 text-white font-mono text-[10px] uppercase px-2 py-0.5 tracking-wider">
                          {col.itemCountText}
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <h3 className="font-serif text-base text-[#1A0E1C] group-hover:text-[#7F5600] transition-colors truncate">
                        {col.title}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-[#837562] group-hover:text-[#7F5600]" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="border border-[#1A0E1C]/10 bg-white p-8 text-center text-xs font-mono text-[#837562] uppercase tracking-wider">
                Wardrobe rails synchronizing from atelier vault.
              </div>
            )}
          </section>
        )}

        {enabledKeys.has('verdigris_promo') && verdigrisAd && (
          <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 bg-[#1E6B62] text-white p-8 sm:p-12 clip-swatch shadow-atelier flex flex-col justify-between relative min-h-[380px]">
                <span className="punched-hole" />
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest bg-white/10 px-3 py-1 clip-swatch-sm text-[#A5EDE1]">
                    <span>Atelier Highlight // Exclusive</span>
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl uppercase tracking-tight leading-tight">
                    {verdigrisAd.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#A5EDE1] max-w-lg leading-relaxed">
                    {verdigrisAd.subtitle ||
                      'Deep zardozi embroidery with satin corded threadwork. Handspun kurta, regal palazzo, and custom hand-screened tissue organza dupatta.'}
                  </p>
                </div>

                <div className="pt-6">
                  {verdigrisAd.linkUrl && (
                    <Link href={verdigrisAd.linkUrl}>
                      <AtelierButton variant="primary" size="md">
                        {verdigrisAd.buttonText || 'View Bespoke Suite'}
                      </AtelierButton>
                    </Link>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#1A0E1C] text-white p-8 clip-swatch shadow-atelier flex flex-col justify-between relative">
                <span className="punched-hole" />
                {verdigrisAd.imageUrl && (
                  <div className="aspect-[4/3] w-full overflow-hidden mb-4 bg-[#241326]">
                    <img src={verdigrisAd.imageUrl} alt={verdigrisAd.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-2">
                  <span className="font-mono text-xs text-[#E5B869] uppercase tracking-wider block">
                    Curated Capsule Edition
                  </span>
                  <h4 className="font-serif text-xl uppercase">Sovereign Silk Co-Ordinates</h4>
                  <p className="font-sans text-xs text-white/70">
                    Hand-loomed mulberry silk cut in modern tailored silhouettes for formal evenings.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {enabledKeys.has('new_arrivals') && (
          <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-12">
            <div className="flex items-end justify-between mb-8 pb-3 border-b border-[#1A0E1C]/15">
              <div>
                <span className="font-mono text-xs uppercase text-[#7F5600] tracking-widest font-bold block mb-1">
                  Couture Inscriptions
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl text-[#1A0E1C] uppercase tracking-tight">
                  New Acquisitions
                </h2>
              </div>
              <Link
                href="/catalogue"
                className="font-mono text-xs text-[#7F5600] uppercase tracking-wider hover:underline flex items-center gap-1 font-bold"
              >
                <span>View All ({newArrivals.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {newArrivals.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {newArrivals.slice(0, 8).map((prod) => (
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
            ) : (
              <div className="bg-white border border-[#1A0E1C]/10 p-12 text-center clip-swatch shadow-atelier-sm max-w-lg mx-auto space-y-3 relative">
                <span className="punched-hole" />
                <h3 className="font-serif text-xl uppercase tracking-tight text-[#1A0E1C]">
                  New Silks Being Inscribed
                </h3>
                <p className="font-sans text-xs text-[#514534]">
                  The atelier is preparing this season&apos;s drops. Use the Admin Panel to curate specimens.
                </p>
                <Link href="/admin/catalogue">
                  <AtelierButton variant="primary" size="sm" className="mt-2">
                    Open Catalogue Manager
                  </AtelierButton>
                </Link>
              </div>
            )}
          </section>
        )}

        {enabledKeys.has('archive_sale') && archiveSaleAd && (
          <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-10">
            <div className="bg-[#1A0E1C] text-white p-8 sm:p-12 clip-swatch shadow-atelier flex flex-col md:flex-row items-center justify-between gap-8 relative border-t-2 border-[#D8371F]">
              <span className="punched-hole" />

              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest bg-[#D8371F] text-white px-3 py-1 clip-swatch-sm font-bold">
                  <span>Urgent Archive Privilege</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl uppercase tracking-tight leading-tight">
                  {archiveSaleAd.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed">
                  {archiveSaleAd.subtitle ||
                    'Rare archival silhouettes and one-of-a-kind showroom samples released at privileged acquisition prices.'}
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-4 shrink-0">
                <div className="flex gap-2 font-mono text-center">
                  <div className="bg-[#241326] p-3 w-16 border border-white/10">
                    <span className="block text-xl font-bold text-[#E5B869]">02</span>
                    <span className="text-[9px] uppercase text-white/60">Days</span>
                  </div>
                  <div className="bg-[#241326] p-3 w-16 border border-white/10">
                    <span className="block text-xl font-bold text-[#E5B869]">14</span>
                    <span className="text-[9px] uppercase text-white/60">Hours</span>
                  </div>
                  <div className="bg-[#241326] p-3 w-16 border border-white/10">
                    <span className="block text-xl font-bold text-[#E5B869]">38</span>
                    <span className="text-[9px] uppercase text-white/60">Mins</span>
                  </div>
                </div>

                {archiveSaleAd.linkUrl && (
                  <Link href={archiveSaleAd.linkUrl}>
                    <AtelierButton variant="urgent" size="lg">
                      {archiveSaleAd.buttonText || 'Access Archive Sale'}
                    </AtelierButton>
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {enabledKeys.has('trust_bar') && (
          <section className="w-full bg-[#FFE7FC] border-y border-[#1A0E1C]/15 py-10 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white border border-[#1A0E1C]/10 clip-swatch-sm shrink-0">
                  <Truck className="w-5 h-5 text-[#7F5600]" />
                </div>
                <div>
                  <span className="font-bold text-[#1A0E1C] uppercase block">White-Glove Dispatch</span>
                  <span className="text-[11px] text-[#514534]">Complimentary on orders &gt; ₹5,000</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white border border-[#1A0E1C]/10 clip-swatch-sm shrink-0">
                  <RotateCcw className="w-5 h-5 text-[#7F5600]" />
                </div>
                <div>
                  <span className="font-bold text-[#1A0E1C] uppercase block">10-Day Exchanges</span>
                  <span className="text-[11px] text-[#514534]">Complimentary door-to-door courier</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white border border-[#1A0E1C]/10 clip-swatch-sm shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#1C6960]" />
                </div>
                <div>
                  <span className="font-bold text-[#1A0E1C] uppercase block">Silk Mark Certified</span>
                  <span className="text-[11px] text-[#514534]">100% pure authentic handloom silks</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white border border-[#1A0E1C]/10 clip-swatch-sm shrink-0">
                  <Scissors className="w-5 h-5 text-[#7F5600]" />
                </div>
                <div>
                  <span className="font-bold text-[#1A0E1C] uppercase block">Bespoke Fitting</span>
                  <span className="text-[11px] text-[#514534]">Tailored margins in every seam</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {enabledKeys.has('reviews_grid') && reviews.length > 0 && (
          <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-16">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#7F5600] font-bold block">
                Patron Accolades
              </span>
              <h2 className="font-serif text-3xl text-[#1A0E1C] uppercase tracking-tight">
                Realised In The World
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-6 border border-[#1A0E1C]/10 clip-swatch shadow-atelier-sm space-y-3 relative"
                >
                  <span className="punched-hole" />
                  <div className="flex items-center gap-1 text-[#E6A117]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  {rev.title && (
                    <h3 className="font-serif text-base text-[#1A0E1C] font-bold">
                      {rev.title}
                    </h3>
                  )}
                  <p className="font-sans text-xs text-[#514534] leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                  <span className="font-mono text-[10px] text-[#1C6960] uppercase tracking-wider block pt-2 border-t border-[#1A0E1C]/10">
                    Verified Patron Inscription
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {enabledKeys.has('newsletter_guild') && <GuildNewsletter />}
      </main>

      <footer className="border-t border-[#1A0E1C]/15 bg-[#1A0E1C] text-[#FFF7FA] py-16 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="font-serif text-2xl uppercase tracking-[0.2em] text-[#FFF7FA] block">
              Novuria
            </span>
            <p className="font-sans text-xs text-[#FFF7FA]/70 leading-relaxed max-w-xs">
              Sovereign silks, handspun weaves, and raw modern tailoring for the contemporary connoisseur.
            </p>
            <div className="font-mono text-xs text-[#E5B869] pt-2">
              Currency: INR (₹) • White-Glove India
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <span className="font-bold uppercase tracking-wider text-[#E5B869] block">
              Couture Silhouettes
            </span>
            <ul className="space-y-2 text-[#FFF7FA]/75">
              <li><Link href="/category/sarees" className="hover:text-white">Concept Sarees</Link></li>
              <li><Link href="/category/co-ords" className="hover:text-white">Draped Co-Ords</Link></li>
              <li><Link href="/category/kurtas" className="hover:text-white">Handloom Kurtas</Link></li>
              <li><Link href="/category/bottoms" className="hover:text-white">Tailored Trousers</Link></li>
            </ul>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <span className="font-bold uppercase tracking-wider text-[#E5B869] block">
              Client Care &amp; Salons
            </span>
            <ul className="space-y-2 text-[#FFF7FA]/75">
              <li><Link href="/account/orders" className="hover:text-white">Track Acquisition</Link></li>
              <li><Link href="/cart" className="hover:text-white">Atelier Shopping Bag</Link></li>
              <li><Link href="/styleguide" className="hover:text-white">Measurements &amp; Sizing</Link></li>
              <li><Link href="/admin" className="hover:text-white">Atelier Console</Link></li>
            </ul>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <span className="font-bold uppercase tracking-wider text-[#E5B869] block">
              Atelier Flagships
            </span>
            <p className="text-[#FFF7FA]/75 text-xs font-sans leading-relaxed">
              Kala Ghoda, Mumbai • Mehrauli, New Delhi • Lavelle Road, Bengaluru
            </p>
            <div className="text-[11px] text-[#E5B869] pt-2">
              Concierge: concierge@novuria.in
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#FFF7FA]/40">
          <p>&copy; 2026 Novuria Atelier. Sovereign Silks &amp; Raw Modern Tailoring. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin" className="hover:underline text-[#E5B869]">
              Operations Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
