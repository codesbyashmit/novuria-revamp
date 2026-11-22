'use client';

import React from 'react';
import { Ruler, Globe, Award, MessageCircle } from 'lucide-react';

const trustFeatures = [
  {
    icon: Ruler,
    title: 'Custom Sizing',
    description: 'Bespoke tailoring crafted to your unique measurements at no extra fee.',
  },
  {
    icon: Globe,
    title: 'Global White-Glove',
    description: 'Express worldwide courier delivery with all import duties prepaid.',
  },
  {
    icon: Award,
    title: 'Guaranteed Authenticity',
    description: '100% hand-loomed silk and certified artisan zardozi craftsmanship.',
  },
  {
    icon: MessageCircle,
    title: 'Private Concierge',
    description: 'Dedicated couture stylists available via WhatsApp or salon visit.',
  },
];

export default function TrustFeatures() {
  return (
    <section className="w-full bg-stone-900/60 py-12 px-6 font-sans border-b border-stone-800/80">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 border border-stone-800 bg-stone-950/60"
              >
                <div className="p-2.5 bg-amber-600/10 border border-amber-600/30 text-amber-500 flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-wider uppercase text-stone-200">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

