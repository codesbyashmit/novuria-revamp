'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface NavCategory {
  id: string;
  name: string;
  slug: string;
}

interface PromotionBanner {
  title: string;
  buttonText?: string | null;
  buttonLink?: string | null;
}

export default function Navbar({
  categories = [],
  announcement,
}: {
  categories: NavCategory[];
  announcement?: PromotionBanner | null;
}) {
  const { totalCount, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currency, setCurrency] = useState('INR');

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 font-sans text-stone-200">
      {announcement && (
        <div className="bg-amber-600 text-stone-950 px-4 py-1.5 text-[11px] font-medium tracking-widest uppercase text-center flex items-center justify-center gap-2">
          <span>{announcement.title}</span>
          {announcement.buttonLink && announcement.buttonText && (
            <Link
              href={announcement.buttonLink}
              className="underline font-semibold hover:text-white transition"
            >
              {announcement.buttonText}
            </Link>
          )}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-stone-400 hover:text-stone-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="flex flex-col text-left">
              <span className="text-xl sm:text-2xl font-serif tracking-[0.25em] font-medium text-stone-100 uppercase">
                NOVURIA
              </span>
              <span className="text-[8px] tracking-[0.35em] text-amber-500 uppercase -mt-0.5">
                Atelier Couture
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-500" />
              <input
                type="text"
                placeholder="Search raw silks, kurtas, lehengas, ensembles..."
                className="w-full bg-stone-900 border border-stone-800 rounded-none pl-9 pr-4 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <div className="relative hidden sm:flex items-center text-stone-400">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-stone-300 text-xs py-1 pr-4 pl-1 border-0 focus:ring-0 cursor-pointer appearance-none"
              >
                <option value="INR" className="bg-stone-900 text-stone-100">INR (₹)</option>
                <option value="USD" className="bg-stone-900 text-stone-100">USD ($)</option>
                <option value="GBP" className="bg-stone-900 text-stone-100">GBP (£)</option>
                <option value="EUR" className="bg-stone-900 text-stone-100">EUR (€)</option>
              </select>
              <ChevronDown className="h-3 w-3 absolute right-0 pointer-events-none text-stone-500" />
            </div>

            <Link
              href="/wishlist"
              className="p-1.5 text-stone-400 hover:text-stone-100 transition relative"
            >
              <Heart className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-850 border border-stone-800 px-3 py-1.5 transition text-stone-200"
            >
              <ShoppingBag className="h-4 w-4 text-amber-500" />
              <span className="hidden sm:inline text-xs tracking-wider uppercase">Bag</span>
              <span className="bg-amber-600 text-stone-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {totalCount}
              </span>
            </button>
          </div>
        </div>

        <nav className="hidden lg:flex items-center justify-center gap-8 py-2.5 border-t border-stone-900 text-[11px] font-medium tracking-[0.18em] uppercase text-stone-300">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="hover:text-amber-400 transition"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-6 py-4 space-y-3">
          <div className="relative w-full mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-500" />
            <input
              type="text"
              placeholder="Search catalogue..."
              className="w-full bg-stone-900 border border-stone-800 pl-9 pr-3 py-2 text-xs text-stone-200"
            />
          </div>
          <div className="flex flex-col space-y-2 text-xs tracking-wider uppercase font-medium">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-stone-300 hover:text-amber-400 border-b border-stone-900"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

