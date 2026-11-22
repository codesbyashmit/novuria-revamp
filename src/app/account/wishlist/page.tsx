'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SwatchCard from '@/components/ui/SwatchCard';
import AtelierPrice from '@/components/ui/AtelierPrice';
import AtelierButton from '@/components/ui/AtelierButton';
import { Heart, Trash2 } from 'lucide-react';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  basePricePaise: number;
  compareAtPricePaise?: number | null;
  sku: string | null;
  imageUrl?: string | null;
}

export default function AccountWishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
    fetch('/api/wishlist')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setItems(data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#FFF7FA] text-[#241726]">
      <header className="border-b border-[#1A0E1C]/10 bg-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-[0.2em] uppercase text-[#1A0E1C]">
            Novuria
          </Link>
          <div className="flex items-center gap-4 text-xs font-mono">
            <Link href="/account/orders" className="text-[#514534] hover:underline uppercase">
              My Acquisitions
            </Link>
            <span className="text-[#7F5600] font-bold uppercase">
              Wishlist ({items.length})
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-8">
        <div className="pb-6 border-b border-[#1A0E1C]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#7F5600] block mb-1">
              Private Collection
            </span>
            <h1 className="font-serif text-3xl text-[#1A0E1C] uppercase tracking-tight">
              Saved Specimens
            </h1>
          </div>

          <Link href="/catalogue">
            <AtelierButton variant="secondary" size="sm">
              Discover More Silks
            </AtelierButton>
          </Link>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-mono text-[#837562] uppercase tracking-widest">
            Querying saved folio...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-[#1A0E1C]/10 p-16 text-center clip-swatch shadow-atelier-sm space-y-4 relative max-w-2xl mx-auto">
            <span className="punched-hole" />
            <div className="w-16 h-16 bg-[#FFE7FC] clip-swatch-sm flex items-center justify-center mx-auto text-[#7F5600]">
              <Heart className="w-8 h-8 text-[#7F5600]" />
            </div>
            <h2 className="font-serif text-2xl uppercase tracking-tight text-[#1A0E1C]">
              Zero Specimens Preserved
            </h2>
            <p className="font-sans text-xs text-[#514534] max-w-md mx-auto">
              Your personal wishlist folio is currently untagged. Inscribe your favourite couture silhouettes while browsing collections.
            </p>
            <Link href="/catalogue">
              <AtelierButton variant="primary" size="md">
                Explore The Atelier
              </AtelierButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map((item) => (
              <SwatchCard key={item.id} shadow className="bg-white border border-[#1A0E1C]/10 flex flex-col justify-between">
                <Link href={`/products/${item.slug}`} className="block">
                  <div className="aspect-[3/4] bg-[#F2DCF1] overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#E9D3E8]" />
                    )}
                  </div>

                  <div className="p-4 space-y-1">
                    <span className="font-mono text-[10px] text-[#1C6960] uppercase block">
                      {item.sku || 'SPECIMEN'}
                    </span>
                    <h3 className="font-serif text-base text-[#1A0E1C] truncate">
                      {item.name}
                    </h3>
                    <AtelierPrice amountInPaise={item.basePricePaise} compareAtPaise={item.compareAtPricePaise || undefined} />
                  </div>
                </Link>

                <div className="p-4 pt-0 border-t border-[#1A0E1C]/5 flex items-center justify-between gap-2 mt-2">
                  <Link href={`/products/${item.slug}`} className="flex-1">
                    <AtelierButton variant="primary" size="sm" className="w-full">
                      View Specimen
                    </AtelierButton>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.productId)}
                    className="p-2 text-[#837562] hover:text-[#D8371F] transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </SwatchCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

