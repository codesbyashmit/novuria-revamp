'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import MegaMenu from '@/components/layout/MegaMenu';
import SearchOverlay from '@/components/layout/SearchOverlay';
import { ChevronDown, Heart, Search, ShoppingBag, User } from 'lucide-react';

interface HeaderProps {
  announcement?: {
    messageText: string;
    linkText?: string | null;
    linkUrl?: string | null;
  } | null;
  categories: { id: string; name: string; slug: string }[];
  collections: { id: string; title: string; slug: string; subtitle?: string | null; imageUrl?: string | null }[];
}

export default function Header({ announcement, categories, collections }: HeaderProps) {
  const { setIsOpen, totalCount, subtotalPaise } = useCart();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-[#FFF7FA]/95 backdrop-blur-md border-b border-[#1A0E1C]/15 shadow-sm">
      {announcement && (
        <div className="bg-[#E6A117] text-[#5A3C00] py-1.5 px-4 text-center select-none text-[11px] font-mono uppercase tracking-widest flex items-center justify-center gap-3">
          <span>{announcement.messageText}</span>
          {announcement.linkUrl && announcement.linkText && (
            <Link href={announcement.linkUrl} className="underline hover:text-[#1A0E1C] font-bold">
              {announcement.linkText}
            </Link>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="font-serif text-2xl lg:text-3xl tracking-[0.2em] text-[#1A0E1C] uppercase font-normal">
            Novuria
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-auto hidden md:block">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-full relative flex items-center bg-[#F2DCF1]/60 px-4 py-2 border border-[#1A0E1C]/20 clip-swatch-sm text-left hover:bg-[#F2DCF1] transition-colors"
          >
            <Search className="w-4 h-4 text-[#837562] mr-2 shrink-0" />
            <span className="font-sans text-xs text-[#837562] flex-1">
              Search sarees, co-ords, fusion wear...
            </span>
            <kbd className="font-mono text-[10px] text-[#837562] px-1.5 py-0.5 bg-[#FFF7FA] border border-[#1A0E1C]/15">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="p-2 text-[#241726] hover:text-[#7F5600] md:hidden"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="hidden lg:flex items-center gap-1 font-mono text-xs text-[#241726] py-1 px-2 bg-[#F2DCF1]/40 border border-[#1A0E1C]/10">
            <span>INR (₹)</span>
          </div>

          <Link
            href="/account/wishlist"
            className="p-2 text-[#241726] hover:text-[#7F5600] transition-colors flex items-center"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 px-3 py-1.5 bg-[#1A0E1C] text-[#FFF7FA] hover:bg-[#E6A117] hover:text-[#1A0E1C] transition-all clip-swatch-sm shadow-atelier-sm"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mono text-xs font-bold">
              {totalCount} ({subtotalPaise > 0 ? `₹${Math.round(subtotalPaise / 100).toLocaleString('en-IN')}` : '₹0'})
            </span>
          </button>

          <Link
            href="/account/orders"
            className="p-2 text-[#241726] hover:text-[#7F5600] transition-colors"
            aria-label="Patron Account"
          >
            <User className="w-5 h-5" />
          </Link>

          <Link
            href="/admin"
            className="font-mono text-[11px] uppercase tracking-wider text-[#7F5600] hover:underline hidden sm:inline ml-1"
          >
            Atelier Console
          </Link>
        </div>
      </div>

      <div className="bg-[#FFF7FA] border-t border-[#1A0E1C]/10">
        <nav className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-6 overflow-x-auto whitespace-nowrap py-2 text-xs font-mono uppercase tracking-widest">
          <Link href="/catalogue" className="flex items-center gap-1.5 text-[#241726] font-bold hover:text-[#7F5600] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6A117]" />
            New In
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="text-[#514534] hover:text-[#241726] transition-colors shrink-0"
            >
              {cat.name}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            className="flex items-center gap-1 text-[#241726] font-bold hover:text-[#7F5600] shrink-0"
          >
            <span>Curated Folio</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <Link href="/search?q=sale" className="text-[#D8371F] font-bold hover:underline shrink-0 ml-auto">
            Sale Archive
          </Link>
        </nav>

        <MegaMenu
          isOpen={megaMenuOpen}
          onClose={() => setMegaMenuOpen(false)}
          categories={categories}
          collections={collections}
        />

        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      </div>
    </header>
  );
}

