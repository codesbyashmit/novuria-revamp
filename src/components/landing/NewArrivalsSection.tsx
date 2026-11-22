'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard, { ProductData } from '@/components/ui/ProductCard';

export default function NewArrivalsSection({ products = [] }: { products: ProductData[] }) {
  if (products.length === 0) return null;

  return (
    <section className="w-full bg-stone-950 py-16 px-6 font-sans border-b border-stone-800/80">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase">
              Autumn Runway Drop
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-stone-100 font-normal mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/category/new-in"
            className="text-xs uppercase tracking-widest text-stone-400 hover:text-amber-400 inline-flex items-center gap-1 transition"
          >
            <span>View All New in ({products.length})</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

