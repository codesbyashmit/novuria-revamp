'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AtelierPrice from '@/components/ui/AtelierPrice';
import { ArrowRight, History, Search, X } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  basePricePaise: number;
  compareAtPricePaise?: number | null;
  sku: string | null;
  imageUrl?: string | null;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [suggestions, setSuggestions] = useState<{ type: string; text: string; href: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Banarasi Brocade',
    'Aubergine Set',
    'Raw Silk Kurta',
    'Satin Co-Ord',
  ]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.products || []);
          setSuggestions(data.suggestions || []);
        })
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const visibleResults = query.trim() ? results : [];
  const visibleSuggestions = query.trim() ? suggestions : [];

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const removeRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((t) => t !== term));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div
        className="fixed inset-0 bg-[#1A0E1C]/85 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed top-6 lg:top-12 inset-x-0 max-w-6xl mx-auto px-4 pointer-events-auto z-50">
        <div className="bg-white p-3 clip-swatch-sm shadow-2xl flex items-center justify-between gap-4 border border-[#1A0E1C]/20">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center bg-[#FFF7FA] px-4 py-2 border border-[#1A0E1C]/10">
            <Search className="w-5 h-5 text-[#7F5600] mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sarees, co-ords, fusion wear, silks..."
              className="w-full bg-transparent font-sans text-sm text-[#241726] placeholder:text-[#837562] outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[#837562] hover:text-[#241726] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-[#1A0E1C] text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#E6A117] hover:text-[#1A0E1C] transition-colors clip-swatch-sm"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
            <kbd className="opacity-60 text-[10px]">ESC</kbd>
          </button>
        </div>

        <div className="bg-white mt-2 p-6 lg:p-8 clip-swatch shadow-2xl border border-[#1A0E1C]/15 max-h-[75vh] overflow-y-auto relative">
          <span className="punched-hole" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6 border-b lg:border-b-0 lg:border-r border-[#1A0E1C]/10 pb-6 lg:pb-0 pr-0 lg:pr-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#514534] font-bold flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-[#7F5600]" />
                    Recent Inquiries
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setRecentSearches([])}
                      className="font-mono text-[10px] uppercase text-[#837562] hover:text-[#D8371F]"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF7FA] border border-[#1A0E1C]/10 clip-swatch-sm text-xs font-mono text-[#241726] hover:border-[#E6A117]"
                    >
                      <button
                        type="button"
                        onClick={() => setQuery(term)}
                        className="hover:underline text-left"
                      >
                        {term}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRecent(term)}
                        className="text-[#837562] hover:text-[#D8371F]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {visibleSuggestions.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-[#1A0E1C]/10">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#7F5600] font-bold block">
                    Curated Categories
                  </span>
                  <div className="space-y-1">
                    {visibleSuggestions.map((s, idx) => (
                      <Link
                        key={idx}
                        href={s.href}
                        onClick={onClose}
                        className="flex items-center justify-between py-1 text-xs font-sans text-[#241726] hover:text-[#7F5600] hover:translate-x-1 transition-all"
                      >
                        <span>{s.text}</span>
                        <ArrowRight className="w-3 h-3 text-[#837562]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A0E1C]/10 pb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#7F5600] font-bold">
                  {loading
                    ? 'Searching Atelier Vault...'
                    : query
                    ? `Matching Specimens (${visibleResults.length})`
                    : 'Curated Atelier Specimens'}
                </span>

                {query && visibleResults.length > 0 && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="font-mono text-xs text-[#7F5600] uppercase hover:underline flex items-center gap-1"
                  >
                    View All Results <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {visibleResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {visibleResults.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      onClick={onClose}
                      className="group bg-[#FFF7FA] p-3 border border-[#1A0E1C]/10 clip-swatch-sm hover:border-[#E6A117] transition-all block"
                    >
                      <div className="aspect-[3/4] bg-[#F2DCF1] overflow-hidden mb-2">
                        {prod.imageUrl ? (
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#E9D3E8]" />
                        )}
                      </div>
                      <span className="font-mono text-[9px] text-[#1C6960] uppercase block">
                        {prod.sku || 'SPECIMEN'}
                      </span>
                      <h4 className="font-serif text-sm text-[#241726] truncate mt-0.5">
                        {prod.name}
                      </h4>
                      <AtelierPrice amountInPaise={prod.basePricePaise} size="sm" />
                    </Link>
                  ))}
                </div>
              ) : query && !loading ? (
                <div className="py-12 text-center space-y-3">
                  <h4 className="font-serif text-lg text-[#241726]">
                    Zero Specimens Discovered for &ldquo;{query}&rdquo;
                  </h4>
                  <p className="font-sans text-xs text-[#514534] max-w-sm mx-auto">
                    Try refining your inquiry by silk weave, silhouette, or explore our curated collections below.
                  </p>
                  <Link href="/catalogue" onClick={onClose} className="inline-block mt-2">
                    <span className="font-mono text-xs uppercase text-[#7F5600] underline font-bold">
                      Explore Full Archive
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="py-8 text-center text-xs font-mono text-[#837562] uppercase tracking-wider">
                  Type a silhouette, weave, or palette to search the atelier.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

