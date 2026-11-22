'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import ProductCard, { ProductData } from '@/components/ui/ProductCard';
import { useCart } from '@/context/CartContext';

export interface BundleData {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  totalPrice: string | number;
  compareAtPrice?: string | number | null;
  imageUrl: string;
  piecesJson: unknown;
}

export default function BestsellersAndEnsemble({
  products = [],
  bundle,
}: {
  products: ProductData[];
  bundle?: BundleData | null;
}) {
  const { addItem } = useCart();

  const pieces = Array.isArray(bundle?.piecesJson)
    ? (bundle?.piecesJson as { name: string; price: string }[])
    : [];

  const handleBuyBundle = () => {
    if (!bundle) return;
    addItem({
      id: bundle.id,
      name: bundle.name,
      slug: bundle.slug,
      price: bundle.totalPrice,
      images: [bundle.imageUrl],
      color: '3-Piece Set',
    });
  };

  return (
    <section className="w-full bg-stone-950 py-16 px-6 font-sans border-b border-stone-800/80">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <span className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase">
            Signature Pieces
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-100 font-normal mt-1">
            Bestsellers & Complete Ensembles
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {bundle && (
            <div className="lg:col-span-4 bg-[#211d1e] border border-amber-900/50 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase block">
                  CURATED 3-PIECE ATELIER LOOK
                </span>

                <h3 className="text-lg font-serif text-stone-100 font-normal mt-1">
                  {bundle.name}
                </h3>
                {bundle.subtitle && (
                  <p className="text-xs text-stone-400 mt-0.5">{bundle.subtitle}</p>
                )}

                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950 border border-stone-800 my-4">
                  <Image
                    src={bundle.imageUrl}
                    alt={bundle.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 30vw"
                  />
                </div>

                <div className="space-y-2 border-t border-stone-800 pt-3">
                  <span className="text-[10px] font-mono tracking-wider text-stone-400 uppercase block">
                    Included in this ensemble:
                  </span>
                  {pieces.map((piece, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-stone-300 py-1 border-b border-stone-850 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-amber-400 flex-shrink-0" />
                        <span className="truncate">{piece.name}</span>
                      </div>
                      <span className="text-stone-400 font-mono text-[11px] flex-shrink-0">
                        {piece.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-xs text-stone-400">Complete Set Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-semibold text-amber-400">
                      INR {parseFloat(bundle.totalPrice as string).toLocaleString('en-IN')}
                    </span>
                    {bundle.compareAtPrice && (
                      <span className="text-xs text-stone-500 line-through">
                        INR {parseFloat(bundle.compareAtPrice as string).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBuyBundle}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold py-3 text-xs uppercase tracking-widest transition"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Buy Full Look</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

