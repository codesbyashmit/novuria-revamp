'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface HeroPromotion {
  tag?: string | null;
  title: string;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
  imageUrl?: string | null;
}

export default function HeroSection({ hero }: { hero?: HeroPromotion | null }) {
  const bgImage =
    hero?.imageUrl ||
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80';

  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[680px] flex items-center justify-center overflow-hidden bg-stone-950 font-sans">
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt={hero?.title || 'Novuria Couture Runway'}
          fill
          priority
          className="object-cover object-center opacity-45 brightness-75 scale-100"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-stone-950/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center">
        {hero?.tag && (
          <p className="text-[10px] sm:text-xs font-mono tracking-[0.35em] text-amber-400 uppercase mb-4">
            {hero.tag}
          </p>
        )}

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-stone-100 font-normal leading-[1.15]">
          {hero?.title || 'SOVEREIGN SILKS & raw modern tailoring'}
        </h1>

        {hero?.subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm text-stone-300 font-light leading-relaxed tracking-wide">
            {hero.subtitle}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {hero?.buttonText && (
            <Link
              href={hero.buttonLink || '/category/new-in'}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-6 py-3 text-xs uppercase tracking-widest transition shadow-lg"
            >
              <span>{hero.buttonText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {hero?.secondaryButtonText && (
            <Link
              href={hero.secondaryButtonLink || '/campaign'}
              className="inline-flex items-center gap-2 bg-stone-950/70 hover:bg-stone-900 border border-stone-700 text-stone-200 px-6 py-3 text-xs uppercase tracking-widest transition backdrop-blur-sm"
            >
              <span>{hero.secondaryButtonText}</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

