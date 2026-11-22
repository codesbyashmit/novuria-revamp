'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import AtelierPrice from '@/components/ui/AtelierPrice';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierModal from '@/components/ui/AtelierModal';
import {
  ChevronDown,
  Heart,
  Minus,
  Plus,
  Ruler,
  Truck,
} from 'lucide-react';

interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  colorHex?: string | null;
  size: string;
  pricePaise: number;
  compareAtPricePaise?: number | null;
  stockOnHand: number;
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
}

interface ReviewItem {
  id: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  fitRating?: string | null;
  createdAt: string;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    sku?: string | null;
    basePricePaise: number;
    compareAtPricePaise?: number | null;
    categoryName?: string;
    categorySlug?: string;
  };
  variants: ProductVariant[];
  images: ProductImage[];
  reviews: ReviewItem[];
}

export default function ProductDetailClient({
  product,
  variants,
  images,
  reviews,
}: ProductDetailClientProps) {
  const { addItem } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [inscribed, setInscribed] = useState(false);

  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [wishlistSaved, setWishlistSaved] = useState(false);

  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  const [accordionOpen, setAccordionOpen] = useState<{ [key: string]: boolean }>({
    composition: true,
    fit: false,
    shipping: false,
    care: false,
  });

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  const currentPricePaise =
    selectedVariant?.pricePaise || product.basePricePaise;
  const currentComparePaise =
    selectedVariant?.compareAtPricePaise || product.compareAtPricePaise;

  const currentStock = selectedVariant?.stockOnHand ?? 5;

  const handleInscribe = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
      setInscribed(true);
      setTimeout(() => setInscribed(false), 2500);
    } finally {
      setAdding(false);
    }
  };

  const toggleWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistSaved(data.saved);
      }
    } catch {}
  };

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeResult('Please enter a 6-digit postal code');
      return;
    }
    setCheckingPincode(true);
    setPincodeResult(null);
    try {
      const res = await fetch(`/api/pincode?code=${pincode}`);
      const data = await res.json();
      if (res.ok && data.serviceable) {
        setPincodeResult(
          `${data.city}, ${data.state}: ${data.estimatedDaysMin}-${data.estimatedDaysMax} business days dispatch. ${data.isCodAvailable ? 'COD Available.' : ''}`
        );
      } else {
        setPincodeResult(data.message || 'Outside express delivery network');
      }
    } catch {
      setPincodeResult('Error verifying pincode');
    } finally {
      setCheckingPincode(false);
    }
  };

  const toggleAccordion = (key: string) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const displayImages =
    images.length > 0
      ? images
      : [{ id: 'fallback', url: '/images/specimen-placeholder.jpg', altText: product.name }];

  const currentImage = displayImages[activeImageIndex] || displayImages[0];

  return (
    <div className="space-y-12">
      <nav className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#837562]">
        <Link href="/" className="hover:text-[#1A0E1C]">Atelier</Link>
        <span>/</span>
        {product.categorySlug && product.categoryName && (
          <>
            <Link href={`/category/${product.categorySlug}`} className="hover:text-[#1A0E1C]">
              {product.categoryName}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#1A0E1C] font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 items-start">
          <div className="flex md:flex-col gap-2 overflow-x-auto w-full md:w-20 shrink-0">
            {displayImages.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-22 md:w-20 md:h-28 bg-[#F2DCF1] clip-swatch-sm overflow-hidden border-2 transition-all shrink-0 ${
                  activeImageIndex === idx
                    ? 'border-[#E6A117] shadow-atelier-sm'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt={img.altText || product.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex-1 w-full bg-[#F2DCF1] clip-swatch shadow-atelier relative overflow-hidden group">
            <span className="punched-hole" />
            <div className="aspect-[3/4] w-full overflow-hidden">
              <img
                src={currentImage.url}
                alt={currentImage.altText || product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-widest uppercase bg-[#1C6960] text-white px-3 py-1 clip-swatch-sm">
              SILK MARK CERTIFIED // SPECIMEN
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-[#1A0E1C]/10 pb-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#1C6960] tracking-widest uppercase font-bold">
                {product.sku || 'SPECIMEN ID // NOVO-ATELIER'}
              </span>
              <button
                type="button"
                onClick={toggleWishlist}
                className={`p-2 transition-colors ${
                  wishlistSaved ? 'text-[#D8371F]' : 'text-[#837562] hover:text-[#1A0E1C]'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlistSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#1A0E1C] uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 pt-2">
              <AtelierPrice
                amountInPaise={currentPricePaise}
                compareAtPaise={currentComparePaise || undefined}
                size="lg"
              />
            </div>

            <span className="font-mono text-[11px] text-[#837562] block">
              Inclusive of all taxes (Apparel GST 12%) • Free White-Glove Shipping over ₹5,000
            </span>
          </div>

          {variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-[#514534] font-bold">
                  Select Size
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="font-mono text-xs text-[#7F5600] uppercase hover:underline flex items-center gap-1 font-bold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Measurements</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-4 py-2 font-mono text-xs uppercase tracking-wider clip-swatch-sm border transition-all ${
                      selectedVariantId === v.id
                        ? 'bg-[#1A0E1C] text-[#FFF7FA] border-[#1A0E1C] shadow-atelier-sm'
                        : 'bg-[#FFF7FA] text-[#241726] border-[#1A0E1C]/20 hover:border-[#E6A117]'
                    }`}
                  >
                    <span>{v.size}</span>
                    {v.color && <span className="opacity-60 ml-1">({v.color})</span>}
                  </button>
                ))}
              </div>

              {currentStock <= 3 && currentStock > 0 && (
                <span className="font-mono text-xs text-[#D8371F] font-bold block pt-1">
                  Only {currentStock} Left In Atelier Vault
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-[#1A0E1C]/30 bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-11 flex items-center justify-center hover:bg-[#FFF7FA] transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 text-[#1A0E1C]" />
              </button>
              <span className="w-10 text-center font-mono text-sm font-bold text-[#1A0E1C]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-11 flex items-center justify-center hover:bg-[#FFF7FA] transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 text-[#1A0E1C]" />
              </button>
            </div>

            <AtelierButton
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleInscribe}
              disabled={adding}
            >
              {adding
                ? 'Inscribing...'
                : inscribed
                ? 'Inscribed In Bag'
                : 'Inscribe To Bag'}
            </AtelierButton>
          </div>

          <div className="p-4 bg-white border border-[#1A0E1C]/10 clip-swatch-sm space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#1A0E1C] font-bold">
              <Truck className="w-4 h-4 text-[#7F5600]" />
              <span>White-Glove Dispatch Checker</span>
            </div>

            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                placeholder="ENTER 6-DIGIT PINCODE"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="flex-1 bg-[#FFF7FA] border border-[#1A0E1C]/20 px-3 py-1.5 font-mono text-xs uppercase outline-none focus:border-[#E6A117]"
              />
              <AtelierButton variant="secondary" size="sm" disabled={checkingPincode}>
                {checkingPincode ? 'Checking...' : 'Check'}
              </AtelierButton>
            </form>

            {pincodeResult && (
              <p className="font-mono text-xs text-[#1C6960] leading-snug">
                {pincodeResult}
              </p>
            )}
          </div>

          <div className="border-t border-[#1A0E1C]/10 divide-y divide-[#1A0E1C]/10 pt-2">
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('composition')}
                className="w-full py-4 flex items-center justify-between text-left font-serif text-lg text-[#1A0E1C]"
              >
                <span>Composition &amp; Provenance</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#7F5600] transition-transform ${
                    accordionOpen.composition ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {accordionOpen.composition && (
                <div className="pb-4 font-sans text-xs text-[#514534] leading-relaxed space-y-2">
                  <p>
                    {product.description ||
                      'Pure mulberry silk cultivated in Karnataka and handspun on traditional shuttle looms. Features intricate zari threadwork on lapels and fluid tailored drape.'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 font-mono text-[11px]">
                    <div>Fibre: 100% Raw Silk</div>
                    <div>Weave: Heavy Satin / 85 GSM</div>
                    <div>Origin: Varanasi &amp; Bengaluru</div>
                    <div>Finish: Sandalwood Wash</div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('fit')}
                className="w-full py-4 flex items-center justify-between text-left font-serif text-lg text-[#1A0E1C]"
              >
                <span>Atelier Fit &amp; Tailoring</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#7F5600] transition-transform ${
                    accordionOpen.fit ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {accordionOpen.fit && (
                <div className="pb-4 font-sans text-xs text-[#514534] leading-relaxed space-y-2">
                  <p>
                    Tailored for structured elegance with fluid ease. Cut true to international sizing. Model is 5&apos;10&quot; (178cm) and wears Size S.
                  </p>
                  <p>
                    Includes complimentary bespoke alteration allowance (+2 inches margin inside every seam).
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                className="w-full py-4 flex items-center justify-between text-left font-serif text-lg text-[#1A0E1C]"
              >
                <span>White-Glove Shipping &amp; Returns</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#7F5600] transition-transform ${
                    accordionOpen.shipping ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {accordionOpen.shipping && (
                <div className="pb-4 font-sans text-xs text-[#514534] leading-relaxed space-y-2">
                  <p>
                    Dispatched in tamper-proof signature atelier cedarwood box with protective breathable muslin dustbag.
                  </p>
                  <p>
                    10-day complimentary door-to-door exchange privilege across all serviceable Indian pincodes.
                  </p>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('reviews')}
                className="w-full py-4 flex items-center justify-between text-left font-serif text-lg text-[#1A0E1C]"
              >
                <span>Patron Reviews ({reviews.length})</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#7F5600] transition-transform ${
                    accordionOpen.reviews ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {accordionOpen.reviews && (
                <div className="pb-4 font-sans text-xs text-[#514534] leading-relaxed space-y-3">
                  {reviews.length > 0 ? (
                    reviews.map((r) => (
                      <div key={r.id} className="border-b border-[#1A0E1C]/10 pb-3">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-[#1A0E1C]">{r.title || 'Verified Patron'}</span>
                          <span className="font-mono text-[10px] text-[#7F5600]">Rating: {r.rating}/5</span>
                        </div>
                        {r.body && <p className="mt-1 text-[#514534]">{r.body}</p>}
                        <span className="text-[10px] font-mono text-[#837562] mt-1 block">{r.createdAt}</span>
                      </div>
                    ))
                  ) : (
                    <p>No patron evaluations recorded for this specimen yet.</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('care')}
                className="w-full py-4 flex items-center justify-between text-left font-serif text-lg text-[#1A0E1C]"
              >
                <span>Care Instructions</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#7F5600] transition-transform ${
                    accordionOpen.care ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {accordionOpen.care && (
                <div className="pb-4 font-sans text-xs text-[#514534] leading-relaxed space-y-2">
                  <p>
                    Dry clean only at an accredited couture fabric cleaner. Iron on reverse using lowest silk setting with protective press cloth. Store flat in breathable muslin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AtelierModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        title="Atelier Measurements &amp; Sizing"
      >
        <div className="space-y-4">
          <p className="font-sans text-xs text-[#514534]">
            All measurements reflect garment dimensions in inches. Compare with your personal bust and waist parameters.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-[#1A0E1C]/15">
              <thead className="bg-[#FFE7FC] border-b border-[#1A0E1C]/15 text-[#1A0E1C] uppercase font-bold">
                <tr>
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5">Bust</th>
                  <th className="p-2.5">Waist</th>
                  <th className="p-2.5">Hip</th>
                  <th className="p-2.5">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A0E1C]/10 text-[#241726]">
                <tr>
                  <td className="p-2.5 font-bold">XS (EU 34)</td>
                  <td className="p-2.5">32&quot;</td>
                  <td className="p-2.5">26&quot;</td>
                  <td className="p-2.5">36&quot;</td>
                  <td className="p-2.5">46&quot;</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">S (EU 36)</td>
                  <td className="p-2.5">34&quot;</td>
                  <td className="p-2.5">28&quot;</td>
                  <td className="p-2.5">38&quot;</td>
                  <td className="p-2.5">46.5&quot;</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">M (EU 38)</td>
                  <td className="p-2.5">36&quot;</td>
                  <td className="p-2.5">30&quot;</td>
                  <td className="p-2.5">40&quot;</td>
                  <td className="p-2.5">47&quot;</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">L (EU 40)</td>
                  <td className="p-2.5">38&quot;</td>
                  <td className="p-2.5">32&quot;</td>
                  <td className="p-2.5">42&quot;</td>
                  <td className="p-2.5">47.5&quot;</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">XL (EU 42)</td>
                  <td className="p-2.5">40&quot;</td>
                  <td className="p-2.5">34&quot;</td>
                  <td className="p-2.5">44&quot;</td>
                  <td className="p-2.5">48&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-right">
            <AtelierButton variant="secondary" size="sm" onClick={() => setSizeGuideOpen(false)}>
              Close Guide
            </AtelierButton>
          </div>
        </div>
      </AtelierModal>
    </div>
  );
}

