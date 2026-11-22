import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import MembershipBanner from '@/components/landing/MembershipBanner';
import CuratedRails from '@/components/landing/CuratedRails';
import AtelierHighlight from '@/components/landing/AtelierHighlight';
import NewArrivalsSection from '@/components/landing/NewArrivalsSection';
import ArchiveSaleBanner from '@/components/landing/ArchiveSaleBanner';
import OccasionSection from '@/components/landing/OccasionSection';
import StylingHighlightBar from '@/components/landing/StylingHighlightBar';
import BestsellersAndEnsemble from '@/components/landing/BestsellersAndEnsemble';
import TrustFeatures from '@/components/landing/TrustFeatures';
import LookbookGallery from '@/components/landing/LookbookGallery';
import GuildNewsletter from '@/components/landing/GuildNewsletter';
import {
  getNavCategories,
  getPromotions,
  getCollections,
  getNewArrivals,
  getOccasionProducts,
  getBestsellers,
  getFeaturedBundle,
  getLookbookStories,
} from '@/lib/data';

export default async function HomePage() {
  const [
    categories,
    promotions,
    collections,
    newArrivals,
    occasionProducts,
    bestsellers,
    featuredBundle,
    lookbookStories,
  ] = await Promise.all([
    getNavCategories(),
    getPromotions(),
    getCollections(),
    getNewArrivals(),
    getOccasionProducts(),
    getBestsellers(),
    getFeaturedBundle(),
    getLookbookStories(),
  ]);

  const announcement = promotions.find((p) => p.type === 'announcement');
  const heroPromo = promotions.find((p) => p.type === 'hero');
  const clubPromo = promotions.find((p) => p.type === 'golden_club');
  const verdigrisPromo = promotions.find((p) => p.type === 'atelier_highlight');
  const gemPromo = promotions.find((p) => p.type === 'bespoke_highlight');
  const archiveSalePromo = promotions.find((p) => p.type === 'archive_sale');

  const verdigrisProduct =
    newArrivals.find((p) => p.slug === 'tiered-capsule-aarkash-ensemble') ||
    bestsellers.find((p) => p.slug === 'tiered-capsule-aarkash-ensemble') ||
    occasionProducts[0] ||
    null;

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
      <Navbar categories={categories} announcement={announcement} />

      <main className="flex-1 flex flex-col">
        <HeroSection hero={heroPromo} />

        <MembershipBanner promo={clubPromo} />

        <CuratedRails collections={collections} />

        <AtelierHighlight
          verdigrisPromo={verdigrisPromo}
          gemPromo={gemPromo}
          featuredProduct={verdigrisProduct}
        />

        <NewArrivalsSection products={newArrivals} />

        <ArchiveSaleBanner promo={archiveSalePromo} />

        <OccasionSection initialProducts={occasionProducts} />

        <StylingHighlightBar />

        <BestsellersAndEnsemble
          products={bestsellers}
          bundle={featuredBundle}
        />

        <TrustFeatures />

        <LookbookGallery stories={lookbookStories} />

        <GuildNewsletter />
      </main>

      <Footer />
    </div>
  );
}
