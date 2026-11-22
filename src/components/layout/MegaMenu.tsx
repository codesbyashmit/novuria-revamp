'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Headset, ShieldCheck } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string; slug: string }[];
  collections: { id: string; title: string; slug: string; subtitle?: string | null; imageUrl?: string | null }[];
}

export default function MegaMenu({ isOpen, onClose, categories, collections }: MegaMenuProps) {
  if (!isOpen) return null;

  const fabrics = [
    { name: 'Raw Mulberry Silk', slug: 'mulberry-silk' },
    { name: 'Zardozi Handwork Threadcraft', slug: 'zardozi' },
    { name: 'Banarasi Kadwa Weave', slug: 'banarasi-kadwa' },
    { name: 'Chanderi Tissue & Gota', slug: 'chanderi-tissue' },
    { name: 'Tassar & Sandalwood Brocade', slug: 'tassar-brocade' },
    { name: 'Bandhani Artisan Dyeing', slug: 'bandhani' },
  ];

  const featuredCollection = collections[0];

  return (
    <div className="relative w-full z-50">
      <div
        className="fixed inset-x-0 top-[110px] bottom-0 bg-[#1A0E1C]/50 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute top-0 left-0 right-0 z-50 bg-[#FAF6FA] border-b border-t border-[#1A0E1C]/15 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 space-y-3 border-r border-[#1A0E1C]/10 pr-6">
              <div className="flex items-center justify-between border-b border-[#1A0E1C]/15 pb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#7F5600] font-bold">
                  Curated Silhouettes
                </span>
                <span className="font-mono text-[10px] text-[#837562]">
                  {categories.length} EDITIONS
                </span>
              </div>

              <ul className="space-y-2 pt-1 font-sans text-xs">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/category/${cat.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between py-1 text-[#241726] hover:text-[#7F5600] hover:translate-x-1 transition-all group"
                      >
                        <span>{cat.name}</span>
                        <ArrowRight className="w-3 h-3 text-[#837562] group-hover:text-[#7F5600] transition-colors" />
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-xs font-mono text-[#837562]">Catalogue syncing...</li>
                )}
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-3 border-r border-[#1A0E1C]/10 pr-6">
              <div className="flex items-center justify-between border-b border-[#1A0E1C]/15 pb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#7F5600] font-bold">
                  By Fabric &amp; Craft
                </span>
                <span className="font-mono text-[10px] text-[#837562]">TEXTILES</span>
              </div>

              <ul className="space-y-2 pt-1 font-sans text-xs">
                {fabrics.map((fab) => (
                  <li key={fab.slug}>
                    <Link
                      href={`/search?q=${encodeURIComponent(fab.name)}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-1 text-[#241726] hover:text-[#7F5600] hover:translate-x-1 transition-all group"
                    >
                      <span>{fab.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1C6960] group-hover:scale-125 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-3 border-r border-[#1A0E1C]/10 pr-6">
              <div className="flex items-center justify-between border-b border-[#1A0E1C]/15 pb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#7F5600] font-bold">
                  Capsule Editions
                </span>
                <span className="font-mono text-[10px] text-[#B81F09] font-bold">CURATED</span>
              </div>

              <ul className="space-y-3 pt-1">
                {collections.map((col) => (
                  <li key={col.id}>
                    <Link href={`/collection/${col.slug}`} onClick={onClose} className="block group">
                      <span className="font-serif text-sm text-[#241726] group-hover:text-[#7F5600] transition-colors block">
                        {col.title}
                      </span>
                      {col.subtitle && (
                        <span className="font-mono text-[10px] text-[#1C6960] font-bold block">
                          {col.subtitle}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3 flex flex-col justify-between gap-4">
              {featuredCollection ? (
                <div className="bg-[#FEE7FC] p-4 border border-[#1A0E1C]/10 clip-swatch shadow-atelier-sm space-y-3 relative">
                  <span className="punched-hole" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#1C6960] font-bold block">
                    Curated Suite
                  </span>
                  <h4 className="font-serif text-base text-[#241726] leading-tight">
                    {featuredCollection.title}
                  </h4>
                  {featuredCollection.subtitle && (
                    <p className="font-sans text-xs text-[#514534] line-clamp-2">
                      {featuredCollection.subtitle}
                    </p>
                  )}
                  <Link
                    href={`/collection/${featuredCollection.slug}`}
                    onClick={onClose}
                    className="font-mono text-xs text-[#7F5600] font-bold uppercase hover:underline flex items-center gap-1"
                  >
                    Explore Suite <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : null}

              <div className="bg-[#1A0E1C] text-[#FFF7FA] p-4 clip-swatch-sm border border-[#E6A117]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#E6A117]">
                  <Headset className="w-4 h-4" />
                  <span className="font-mono text-xs uppercase font-bold tracking-wider">
                    Atelier Concierge
                  </span>
                </div>
                <p className="font-sans text-xs text-[#FFF7FA]/80">
                  Complimentary 1-on-1 virtual styling and bespoke drape curation with master drapers.
                </p>
                <div className="pt-2 border-t border-[#FFF7FA]/10 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#E6A117]">NO APPOINTMENT FEE</span>
                  <Link href="/admin" onClick={onClose} className="underline uppercase text-white hover:text-[#E6A117]">
                    Inquire
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F2DCF1] border-t border-[#1A0E1C]/10 py-2.5 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 font-mono text-xs text-[#514534]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1C6960]" />
              <span className="font-bold text-[#241726]">Atelier Assurance:</span>
              <span>All handcrafted pieces include Silk Mark certification &amp; complimentary bespoke tailoring</span>
            </div>
            <Link href="/styleguide" onClick={onClose} className="text-[#7F5600] hover:underline font-bold flex items-center gap-1">
              <span>View Atelier Sizing &amp; Swatch Dispatch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

