import {
  getNavCategories,
  getCollections,
  getNewArrivals,
  getHeroSlides,
  getAdSlots,
  getAnnouncementMessages,
} from '@/lib/data';
import SwatchCard from '@/components/ui/SwatchCard';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierPrice from '@/components/ui/AtelierPrice';
import Link from 'next/link';

export default async function HomePage() {
  const [
    categories,
    heroSlides,
    adSlots,
    collections,
    newArrivals,
    announcements,
  ] = await Promise.all([
    getNavCategories(),
    getHeroSlides(),
    getAdSlots(),
    getCollections(),
    getNewArrivals(),
    getAnnouncementMessages(),
  ]);

  const announcement = announcements[0];
  const primaryHero = heroSlides[0];
  const leaderboardAd = adSlots.find((a) => a.slotKey === 'leaderboard');

  return (
    <div className="flex min-h-screen flex-col bg-[#0F0814] text-[#F5EFE6]">
      <header className="sticky top-0 z-40 bg-[#1A0E1C]/95 backdrop-blur-md border-b border-[#2C1810]">
        {announcement && (
          <div className="bg-[#2C1810] py-2 px-4 text-center text-xs tracking-[0.2em] uppercase font-mono text-[#E5B869] border-b border-[#3D261C]">
            <span>{announcement.messageText}</span>
            {announcement.linkUrl && announcement.linkText && (
              <Link href={announcement.linkUrl} className="ml-3 underline font-sans text-xs hover:text-[#FAF5EE]">
                {announcement.linkText}
              </Link>
            )}
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl lg:text-3xl tracking-[0.25em] text-[#F5EFE6] uppercase font-normal">
            Novuria
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="text-xs font-sans uppercase tracking-[0.2em] text-[#F5EFE6]/80 hover:text-[#E5B869] transition-colors"
                >
                  {cat.name}
                </Link>
              ))
            ) : (
              <span className="text-xs font-mono tracking-widest text-[#F5EFE6]/40 uppercase">Atelier Catalogue Loading</span>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs font-mono tracking-widest text-[#E5B869] hover:underline uppercase">
              Admin
            </Link>
            <Link href="/cart" className="text-xs font-mono tracking-widest text-[#F5EFE6] hover:text-[#E5B869] uppercase">
              Bag (0)
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {primaryHero ? (
          <section className="relative w-full min-h-[600px] flex items-center justify-center bg-[#1A0E1C] px-6 py-24 border-b border-[#2C1810]">
            <div className="max-w-4xl text-center space-y-6">
              {primaryHero.eyebrowTag && (
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#E5B869]">{primaryHero.eyebrowTag}</p>
              )}
              <h1 className="font-serif text-4xl lg:text-6xl font-normal tracking-tight text-[#F5EFE6] leading-tight">
                {primaryHero.title} {primaryHero.italicAccent && <span className="italic">{primaryHero.italicAccent}</span>}
              </h1>
              {primaryHero.subtitle && (
                <p className="text-sm lg:text-base font-sans text-[#F5EFE6]/80 max-w-2xl mx-auto leading-relaxed">
                  {primaryHero.subtitle}
                </p>
              )}
              {primaryHero.ctaLink && primaryHero.ctaText && (
                <div className="pt-4">
                  <Link href={primaryHero.ctaLink}>
                    <AtelierButton variant="primary">{primaryHero.ctaText}</AtelierButton>
                  </Link>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="w-full py-20 px-6 border-b border-[#2C1810] text-center bg-[#1A0E1C]">
            <div className="max-w-xl mx-auto space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E5B869]">Novuria Atelier</span>
              <h1 className="font-serif text-3xl lg:text-4xl font-normal text-[#F5EFE6]">
                Curated Luxury Collections
              </h1>
              <p className="text-xs font-mono text-[#F5EFE6]/60 tracking-wider">
                Active seasonal showcase arriving from the atelier vault.
              </p>
            </div>
          </section>
        )}

        {leaderboardAd && (
          <section className="w-full bg-[#2C1810] border-b border-[#3D261C] py-3 px-6 text-center">
            <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <span className="text-[#E5B869] uppercase tracking-wider">{leaderboardAd.title}</span>
              {leaderboardAd.linkUrl && leaderboardAd.buttonText && (
                <Link href={leaderboardAd.linkUrl} className="underline uppercase tracking-widest text-[#F5EFE6] hover:text-[#E5B869]">
                  {leaderboardAd.buttonText}
                </Link>
              )}
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 w-full">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#2C1810]">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5B869] block mb-1">Couture Vault</span>
              <h2 className="font-serif text-2xl lg:text-3xl text-[#F5EFE6]">New Acquisitions</h2>
            </div>
            <Link href="/catalogue" className="text-xs font-mono uppercase tracking-widest text-[#E5B869] hover:underline">
              View All
            </Link>
          </div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newArrivals.map((prod) => (
                <SwatchCard key={prod.id} shadow className="bg-[#1A0E1C] border border-[#2C1810]">
                  <Link href={`/products/${prod.slug}`} className="block p-4">
                    <span className="font-serif text-base text-[#F5EFE6] block mb-2">{prod.name}</span>
                    <AtelierPrice amountInPaise={prod.basePricePaise} compareAtPaise={prod.compareAtPricePaise || undefined} />
                  </Link>
                </SwatchCard>
              ))}
            </div>
          ) : (
            <div className="border border-[#2C1810] bg-[#1A0E1C] p-12 text-center space-y-3">
              <p className="font-serif text-lg text-[#F5EFE6]">New Silks Being Inscribed</p>
              <p className="text-xs font-mono text-[#F5EFE6]/60 tracking-wider">
                The atelier is preparing this season&apos;s drops. Use the Admin Panel to curate specimens.
              </p>
            </div>
          )}
        </section>

        {collections.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12 w-full border-t border-[#2C1810]">
            <div className="mb-8">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5B869] block mb-1">Atelier Curations</span>
              <h2 className="font-serif text-2xl lg:text-3xl text-[#F5EFE6]">Curated Wardrobe Rails</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collection/${col.slug}`}
                  className="group block border border-[#2C1810] bg-[#1A0E1C] p-6 hover:border-[#E5B869] transition-all"
                >
                  <h3 className="font-serif text-lg text-[#F5EFE6] group-hover:text-[#E5B869]">{col.title}</h3>
                  {col.subtitle && <p className="text-xs font-mono text-[#F5EFE6]/60 mt-2">{col.subtitle}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[#2C1810] bg-[#1A0E1C] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-serif text-xl tracking-[0.2em] text-[#F5EFE6] uppercase">Novuria Atelier</span>
          <p className="text-xs font-mono text-[#F5EFE6]/40 tracking-wider">
            &copy; 2026 Novuria. Sovereign Silks &amp; Raw Modern Tailoring. All Rights Reserved.
          </p>
          <div className="flex gap-4 text-xs font-mono text-[#E5B869]">
            <Link href="/admin" className="hover:underline uppercase tracking-wider">
              Atelier Management
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
