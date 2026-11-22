'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export interface CollectionItem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  itemCountText?: string | null;
  imageUrl: string;
}

export default function CuratedRails({ collections = [] }: { collections: CollectionItem[] }) {
  if (collections.length === 0) return null;

  return (
    <section className="w-full bg-stone-950 py-16 px-6 font-sans border-b border-stone-800/80">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase">
              Curated Wardrobe Rails
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-stone-100 font-normal mt-1">
              Heritage Weaves & Silhouettes
            </h2>
          </div>
          <Link
            href="/collections"
            className="text-xs uppercase tracking-widest text-stone-400 hover:text-amber-400 inline-flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group flex flex-col bg-stone-900 border border-stone-850 hover:border-amber-600/60 transition overflow-hidden"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-950">
                <Image
                  src={col.imageUrl}
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition" />
              </div>

              <div className="p-3 bg-stone-900 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-xs font-serif font-medium text-stone-100 group-hover:text-amber-400 transition truncate">
                    {col.title}
                  </h3>
                  {col.subtitle && (
                    <p className="text-[10px] text-stone-400 truncate mt-0.5">{col.subtitle}</p>
                  )}
                </div>
                {col.itemCountText && (
                  <span className="text-[9px] font-mono text-stone-500 tracking-wider mt-2">
                    {col.itemCountText}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

