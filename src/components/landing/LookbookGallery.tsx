'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';

export interface LookbookStoryData {
  id: string;
  personName: string;
  city: string;
  quote: string;
  rating: number;
  imageUrl: string;
  outfitTitle: string;
  productSlug?: string | null;
}

export default function LookbookGallery({ stories = [] }: { stories: LookbookStoryData[] }) {
  if (stories.length === 0) return null;

  return (
    <section className="w-full bg-stone-950 py-16 px-6 font-sans border-b border-stone-800/80">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase">
              Editorial Gallery
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-stone-100 font-normal mt-1">
              Realised in the World
            </h2>
          </div>
          <Link
            href="/lookbook"
            className="text-xs uppercase tracking-widest text-stone-400 hover:text-amber-400 inline-flex items-center gap-1 transition"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stories.map((story) => (
            <div
              key={story.id}
              className="group flex flex-col bg-stone-900 border border-stone-850 overflow-hidden"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-950">
                <Image
                  src={story.imageUrl}
                  alt={story.personName}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-mono text-amber-400 tracking-wider uppercase block">
                    {story.city}
                  </span>
                  <p className="text-xs font-serif text-stone-100 font-medium truncate">
                    {story.personName}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-stone-900 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(story.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-500" />
                    ))}
                  </div>

                  <p className="text-xs text-stone-300 italic leading-relaxed line-clamp-3">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 truncate max-w-[140px]">{story.outfitTitle}</span>
                  {story.productSlug && (
                    <Link
                      href={`/products/${story.productSlug}`}
                      className="text-amber-500 hover:text-amber-400 font-medium inline-flex items-center gap-1"
                    >
                      <span>Shop Look</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

