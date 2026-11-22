'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: string | number;
  compareAtPrice?: string | number | null;
  images?: string[] | null;
  badges?: string[] | null;
  color?: string | null;
  colorHex?: string | null;
  fabric?: string | null;
  occasion?: string | null;
}

export default function ProductCard({ product }: { product: ProductData }) {
  const { addItem } = useCart();
  const numericPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const numericComparePrice =
    product.compareAtPrice ? (typeof product.compareAtPrice === 'string' ? parseFloat(product.compareAtPrice) : product.compareAtPrice) : null;

  const displayImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative flex flex-col font-sans">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-900 border border-stone-800">
        <Image
          src={displayImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badges &&
            product.badges.map((badge, idx) => (
              <span
                key={idx}
                className="bg-stone-950/90 text-stone-200 border border-stone-700/60 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-sm"
              >
                {badge}
              </span>
            ))}
        </div>

        <button
          type="button"
          onClick={() => addItem(product)}
          className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 bg-stone-950/90 hover:bg-amber-600 text-stone-200 hover:text-stone-950 border border-stone-700 py-2.5 text-xs uppercase tracking-widest transition opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>

      <div className="mt-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.slug}`} className="hover:underline">
            <h3 className="text-xs font-serif font-medium tracking-wide text-stone-100 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          {product.colorHex && (
            <span
              className="h-2.5 w-2.5 rounded-full border border-stone-700 flex-shrink-0 mt-1"
              style={{ backgroundColor: product.colorHex }}
              title={product.color || undefined}
            />
          )}
        </div>

        {product.fabric && (
          <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{product.fabric}</p>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xs font-semibold text-stone-200">
            INR {numericPrice.toLocaleString('en-IN')}
          </span>
          {numericComparePrice && (
            <span className="text-[11px] text-stone-500 line-through">
              INR {numericComparePrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

