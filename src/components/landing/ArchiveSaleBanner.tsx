'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Lock } from 'lucide-react';

interface ArchiveSalePromo {
  tag?: string | null;
  title: string;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
  imageUrl?: string | null;
  countdownTarget?: string | Date | null;
}

export default function ArchiveSaleBanner({ promo }: { promo?: ArchiveSalePromo | null }) {
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 18, minutes: 22, seconds: 46 });

  useEffect(() => {
    const target = promo?.countdownTarget
      ? new Date(promo.countdownTarget).getTime()
      : Date.now() + 1000 * 60 * 60 * 114;

    const timer = setInterval(() => {
      const now = Date.now();
      const distance = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [promo?.countdownTarget]);

  if (!promo) return null;

  return (
    <section className="w-full bg-stone-950 py-16 px-6 font-sans border-b border-stone-800/80">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden border border-stone-800 bg-stone-900">
          <div className="relative min-h-[300px] lg:col-span-5 overflow-hidden bg-stone-950">
            <Image
              src={
                promo.imageUrl ||
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'
              }
              alt="Private Archive"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-stone-950/20" />
          </div>

          <div className="lg:col-span-7 bg-[#231b26] p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400">
                <Lock className="h-3.5 w-3.5" />
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase">
                  {promo.tag || 'VIP ACCESS EXCLUSIVE'}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-serif text-stone-100 font-normal mt-3">
                {promo.title || 'Private Archive Sale'}
              </h3>

              <p className="text-xs sm:text-sm text-stone-300 font-light mt-3 leading-relaxed max-w-xl">
                {promo.subtitle ||
                  'Up to 30% private privileges on selected archival runway editions and limited-piece restocks.'}
              </p>

              <div className="mt-8 flex items-center gap-3 font-mono">
                <div className="bg-stone-950/70 border border-stone-800 px-3 py-2 text-center min-w-[56px]">
                  <span className="text-lg font-bold text-amber-400 block leading-tight">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400">Days</span>
                </div>
                <span className="text-amber-500 font-bold">:</span>
                <div className="bg-stone-950/70 border border-stone-800 px-3 py-2 text-center min-w-[56px]">
                  <span className="text-lg font-bold text-amber-400 block leading-tight">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400">Hours</span>
                </div>
                <span className="text-amber-500 font-bold">:</span>
                <div className="bg-stone-950/70 border border-stone-800 px-3 py-2 text-center min-w-[56px]">
                  <span className="text-lg font-bold text-amber-400 block leading-tight">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400">Mins</span>
                </div>
                <span className="text-amber-500 font-bold">:</span>
                <div className="bg-stone-950/70 border border-stone-800 px-3 py-2 text-center min-w-[56px]">
                  <span className="text-lg font-bold text-amber-400 block leading-tight">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400">Secs</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={promo.buttonLink || '/archive-sale'}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-6 py-3 text-xs uppercase tracking-widest transition shadow-md inline-flex items-center gap-2"
              >
                <span>{promo.buttonText || 'SHOP PRIVATE ARCHIVE'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              {promo.secondaryButtonText && (
                <Link
                  href={promo.secondaryButtonLink || '/catalog'}
                  className="bg-stone-900/60 hover:bg-stone-900 text-stone-300 border border-stone-700 px-5 py-3 text-xs uppercase tracking-wider transition"
                >
                  {promo.secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

