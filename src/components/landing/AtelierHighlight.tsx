'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Gem, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { ProductData } from '@/components/ui/ProductCard';

interface AtelierPromo {
  tag?: string | null;
  title: string;
  description?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
}

export default function AtelierHighlight({
  verdigrisPromo,
  gemPromo,
  featuredProduct,
}: {
  verdigrisPromo?: AtelierPromo | null;
  gemPromo?: AtelierPromo | null;
  featuredProduct?: ProductData | null;
}) {
  const { addItem } = useCart();

  return (
    <section className="w-full bg-stone-950 py-16 px-6 font-sans border-b border-stone-800/80">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex-1 bg-emerald-950/40 border border-emerald-900/60 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-emerald-800/30 pointer-events-none">
                <Sparkles className="h-28 w-28" />
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] text-emerald-400 uppercase">
                  {verdigrisPromo?.tag || 'ATELIER HIGHLIGHT // EXCLUSIVE'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-stone-100 mt-2 font-normal">
                  {verdigrisPromo?.title || 'THE VERDIGRIS SUITE'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-light mt-3 leading-relaxed max-w-xl">
                  {verdigrisPromo?.description ||
                    'Dense zardozi embroidery with satin corded threadwork. Handspun kurta, regal palazzo, and custom hand-screened tissue organza dupatta.'}
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href={verdigrisPromo?.buttonLink || '/products/tiered-capsule-aarkash-ensemble'}
                  className="inline-flex items-center gap-2 bg-stone-950 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 px-5 py-2.5 text-xs uppercase tracking-widest transition"
                >
                  <span>{verdigrisPromo?.buttonText || 'VIEW BESPOKE SUITE'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-purple-950/30 border border-purple-900/50 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-900/40 border border-purple-800/60 text-purple-300 flex-shrink-0">
                  <Gem className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-purple-400 uppercase block">
                    {gemPromo?.tag || 'CURATED BESPOKE'}
                  </span>
                  <h4 className="text-base font-serif text-stone-100 font-normal">
                    {gemPromo?.title || 'Novuria x Agate Gem Grid'}
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {gemPromo?.description ||
                      'Limited edition natural mineral gems embedded on raw dupion silk bands.'}
                  </p>
                </div>
              </div>

              <Link
                href={gemPromo?.buttonLink || '/bespoke'}
                className="flex-shrink-0 bg-stone-900 hover:bg-stone-850 text-stone-200 border border-purple-900/80 px-4 py-2 text-xs uppercase tracking-wider transition"
              >
                {gemPromo?.buttonText || 'REQUEST COMMISSION'}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 bg-stone-900 border border-stone-850 p-6 flex flex-col justify-between">
            {featuredProduct ? (
              <>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-950 border border-stone-800">
                  <Image
                    src={
                      featuredProduct.images && featuredProduct.images.length > 0
                        ? featuredProduct.images[0]
                        : 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80'
                    }
                    alt={featuredProduct.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute top-3 left-3 bg-stone-950/90 text-amber-400 border border-amber-900/60 px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase">
                    FEATURED ATELIER PIECE
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/products/${featuredProduct.slug}`} className="hover:underline">
                        <h4 className="text-sm font-serif text-stone-100 font-medium">
                          {featuredProduct.name}
                        </h4>
                      </Link>
                      {featuredProduct.fabric && (
                        <p className="text-[11px] text-stone-400">{featuredProduct.fabric}</p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-amber-400">
                      INR {parseFloat(featuredProduct.price as string).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => addItem(featuredProduct.id)}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold py-2.5 text-xs uppercase tracking-widest transition"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Reserve Piece</span>
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

