'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Crown } from 'lucide-react';

interface ClubPromotion {
  tag?: string | null;
  title: string;
  buttonText?: string | null;
  buttonLink?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
}

export default function MembershipBanner({ promo }: { promo?: ClubPromotion | null }) {
  if (!promo) return null;

  return (
    <div className="w-full bg-amber-950/40 border-y border-amber-900/60 font-sans text-stone-200 py-4 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="p-2 bg-amber-600/20 rounded-full border border-amber-600/40 text-amber-400 flex-shrink-0">
            <Crown className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase block font-semibold">
              {promo.tag || 'GOLDEN COUTURE CLUB'}
            </span>
            <p className="text-xs text-stone-300 mt-0.5">
              {promo.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {promo.buttonText && (
            <Link
              href={promo.buttonLink || '/salon'}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-1.5 text-xs uppercase tracking-wider transition inline-flex items-center gap-1.5"
            >
              <span>{promo.buttonText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {promo.secondaryButtonText && (
            <Link
              href={promo.secondaryButtonLink || '/membership'}
              className="text-xs uppercase tracking-wider text-stone-300 hover:text-amber-400 border border-stone-800 px-3 py-1.5 transition"
            >
              {promo.secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

