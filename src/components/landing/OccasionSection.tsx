'use client';

import React, { useState } from 'react';
import ProductCard, { ProductData } from '@/components/ui/ProductCard';

const occasions = [
  { label: 'COUTURE BRIDAL', key: 'bridal' },
  { label: 'SANGEET & MEHENDI', key: 'sangeet' },
  { label: 'ROYAL RECEPTION', key: 'reception' },
  { label: 'FESTIVAL CELEBRATION', key: 'festival' },
  { label: 'MODERN RED CARPET', key: 'red-carpet' },
];

export default function OccasionSection({ initialProducts = [] }: { initialProducts: ProductData[] }) {
  const [activeOccasion, setActiveOccasion] = useState('bridal');

  const filteredProducts = initialProducts.filter((product) => {
    if (!product.occasion) return true;
    return product.occasion.toLowerCase() === activeOccasion;
  });

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : initialProducts.slice(0, 4);

  return (
    <section className="w-full bg-stone-950 py-16 px-6 font-sans border-b border-stone-800/80">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase">
              Curated Wardrobe
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-stone-100 font-normal mt-1">
              Shop by Occasion
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {occasions.map((occ) => (
              <button
                key={occ.key}
                type="button"
                onClick={() => setActiveOccasion(occ.key)}
                className={`whitespace-nowrap px-3.5 py-1.5 text-[10px] uppercase tracking-widest font-medium transition border ${
                  activeOccasion === occ.key
                    ? 'bg-amber-600 border-amber-600 text-stone-950 font-semibold'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                {occ.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

