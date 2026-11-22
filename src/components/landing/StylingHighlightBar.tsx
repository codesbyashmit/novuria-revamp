'use client';

import React from 'react';
import Link from 'next/link';
import { Scissors, Sparkles } from 'lucide-react';

export default function StylingHighlightBar() {
  return (
    <div className="w-full bg-[#2a1a24] text-rose-200/90 py-3 px-6 border-b border-rose-950 font-sans text-xs">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Scissors className="h-3.5 w-3.5 text-amber-400" />
          <span className="tracking-[0.2em] uppercase text-[11px] font-medium">
            COMPLIMENTARY STYLING & SIZING &bull; BESPOKE TAILORING AVAILABLE
          </span>
        </div>

        <div className="flex items-center gap-4 mx-auto sm:mx-0 text-[11px]">
          <Link href="/bespoke" className="underline hover:text-white transition flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Book Video Consultation</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

