'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-stone-950 text-stone-400 border-t border-stone-800/80 font-sans text-xs">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-serif tracking-[0.25em] font-medium text-stone-100 uppercase">
                NOVURIA
              </span>
              <span className="block text-[8px] tracking-[0.35em] text-amber-500 uppercase mt-0.5">
                Atelier Couture &bull; Est. 2024
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Sovereign craftsmanship, handspun weaves, and raw modern tailoring.
              Bridging centuries of Indian heritage textiles with architectural modern silhouettes.
            </p>
            <div className="pt-2 text-[11px] text-stone-500">
              <p>Client Concierge: concierge@novuria.com</p>
              <p>Appointments: +91 (0) 22 8493 0291</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-stone-200 mb-4 font-mono">
              Quick Orders
            </h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li><Link href="/category/new-in" className="hover:text-stone-200">New Arrivals</Link></li>
              <li><Link href="/category/sarees" className="hover:text-stone-200">Pure Silk Sarees</Link></li>
              <li><Link href="/category/kurta-sets" className="hover:text-stone-200">Handspun Kurta Sets</Link></li>
              <li><Link href="/category/suits" className="hover:text-stone-200">Tailored Anarkalis</Link></li>
              <li><Link href="/archive-sale" className="hover:text-amber-400">Private Archive Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-stone-200 mb-4 font-mono">
              Client Care
            </h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li><Link href="/bespoke" className="hover:text-stone-200">Bespoke Couture</Link></li>
              <li><Link href="/sizing" className="hover:text-stone-200">Sizing & Custom Tailoring</Link></li>
              <li><Link href="/shipping" className="hover:text-stone-200">Worldwide Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-stone-200">Returns & Exchanges</Link></li>
              <li><Link href="/concierge" className="hover:text-stone-200">Personal Stylist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-stone-200 mb-4 font-mono">
              Boutiques & Salons
            </h4>
            <ul className="space-y-2 text-stone-400 text-xs">
              <li><span className="text-stone-300 font-medium">Mumbai Flagship</span> — Kala Ghoda</li>
              <li><span className="text-stone-300 font-medium">New Delhi</span> — Mehrauli</li>
              <li><span className="text-stone-300 font-medium">Bengaluru</span> — Lavelle Road</li>
              <li><span className="text-stone-300 font-medium">London</span> — Mayfair (By Appointment)</li>
              <li><span className="text-stone-300 font-medium">Dubai</span> — DIFC Gate Village</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-stone-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div className="flex items-center gap-6">
            <span className="tracking-wider uppercase">Visa</span>
            <span className="tracking-wider uppercase">Mastercard</span>
            <span className="tracking-wider uppercase">American Express</span>
            <span className="tracking-wider uppercase">Apple Pay</span>
            <span className="tracking-wider uppercase">UPI / NetBanking</span>
          </div>

          <p className="text-stone-500">
            &copy; 2026 NOVURIA ATELIER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

