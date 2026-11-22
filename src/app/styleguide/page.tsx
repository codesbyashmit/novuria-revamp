'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SwatchCard from '@/components/ui/SwatchCard';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierInput from '@/components/ui/AtelierInput';
import AtelierCheckbox from '@/components/ui/AtelierCheckbox';
import AtelierRadio from '@/components/ui/AtelierRadio';
import AtelierChip from '@/components/ui/AtelierChip';
import AtelierBadge from '@/components/ui/AtelierBadge';
import AtelierPrice from '@/components/ui/AtelierPrice';
import AtelierModal from '@/components/ui/AtelierModal';
import AtelierDrawer from '@/components/ui/AtelierDrawer';
import AtelierSkeleton from '@/components/ui/AtelierSkeleton';

export default function StyleGuidePage() {
  const [checkboxState, setCheckboxState] = useState(true);
  const [radioState, setRadioState] = useState('option-1');
  const [activeChip, setActiveChip] = useState('raw-silk');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inputValue, setInputValue] = useState('Verdigris Mulberry Silk');

  const palette = [
    { name: 'Ground Canvas', hex: '#EDE8EE', text: '#1A0E1C' },
    { name: 'Ink Neutral', hex: '#1A0E1C', text: '#EDE8EE' },
    { name: 'Primary Saffron', hex: '#E6A117', text: '#1A0E1C' },
    { name: 'Secondary Verdigris', hex: '#1E6B62', text: '#FFFFFF' },
    { name: 'Urgent Vermilion', hex: '#D8371F', text: '#FFFFFF' },
    { name: 'Surface Bright', hex: '#FFF7FA', text: '#241726' },
    { name: 'Surface Container', hex: '#FEE7FC', text: '#241726' },
  ];

  return (
    <div className="min-h-screen bg-[#fff7fa] text-[#241726] p-8 lg:p-16 max-w-7xl mx-auto space-y-16">
      <div className="border-b border-[#1a0e1c]/20 pb-6 flex items-baseline justify-between">
        <div>
          <span className="font-label-code text-xs text-[#e6a117] uppercase tracking-widest">
            Design Tokens & Components
          </span>
          <h1 className="font-display-hero text-4xl lg:text-6xl text-[#1a0e1c] mt-2">
            Novuria Atelier System
          </h1>
        </div>
        <Link
          href="/"
          className="font-label-code text-xs uppercase tracking-wider text-[#1a0e1c] hover:text-[#e6a117] border border-[#1a0e1c] px-4 py-2"
        >
          Return to Storefront
        </Link>
      </div>

      <section className="space-y-6">
        <h2 className="font-headline-md text-2xl text-[#1a0e1c] border-b border-[#1a0e1c]/15 pb-2">
          01 / Colors & Swatches
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {palette.map((c) => (
            <SwatchCard
              key={c.hex}
              className="p-4 border border-[#1a0e1c]/20 flex flex-col justify-between h-32"
              style={{ backgroundColor: c.hex, color: c.text }}
            >
              <span className="font-label-code text-[10px] tracking-wider uppercase font-bold">
                {c.name}
              </span>
              <span className="font-mono text-xs uppercase">{c.hex}</span>
            </SwatchCard>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-headline-md text-2xl text-[#1a0e1c] border-b border-[#1a0e1c]/15 pb-2">
          02 / Typographic Hierarchy
        </h2>
        <div className="space-y-6 bg-[#fee7fc]/40 p-8 border border-[#1a0e1c]/15">
          <div>
            <span className="font-label-code text-[10px] text-[#514534] uppercase">
              Display Hero &bull; Bodoni Moda 72px / Bold
            </span>
            <p className="font-display-hero text-4xl sm:text-6xl text-[#1a0e1c]">
              SOVEREIGN SILKS
            </p>
          </div>

          <div>
            <span className="font-label-code text-[10px] text-[#514534] uppercase">
              Headline Large &bull; Bodoni Moda 48px / SemiBold
            </span>
            <p className="font-headline-lg text-3xl sm:text-4xl text-[#1a0e1c]">
              Curated Wardrobe Rails
            </p>
          </div>

          <div>
            <span className="font-label-code text-[10px] text-[#514534] uppercase">
              Title Editorial &bull; Bodoni Moda 22px / Regular Italic
            </span>
            <p className="font-title-editorial italic text-xl text-[#1a0e1c]">
              Handspun Chanderi coats and aged metallic zari
            </p>
          </div>

          <div>
            <span className="font-label-code text-[10px] text-[#514534] uppercase">
              Body Medium &bull; Hanken Grotesk 15px / Regular
            </span>
            <p className="font-body-md text-sm text-[#241726] max-w-2xl leading-relaxed">
              Sculpted drape meets ceremonial brocade in aged sandalwood, deep verdigris, and royal
              saffron. Each garment is hand-loomed and finished by master artisans.
            </p>
          </div>

          <div>
            <span className="font-label-code text-[10px] text-[#514534] uppercase">
              Price Large & Medium &bull; Space Mono
            </span>
            <div className="flex gap-6 mt-1">
              <AtelierPrice amountInPaise={2450000} compareAtPaise={2900000} size="lg" />
              <AtelierPrice amountInPaise={1890000} size="md" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-headline-md text-2xl text-[#1a0e1c] border-b border-[#1a0e1c]/15 pb-2">
          03 / Interactive Buttons
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <AtelierButton variant="primary">Add to Bag</AtelierButton>
          <AtelierButton variant="secondary">View Specimen</AtelierButton>
          <AtelierButton variant="urgent">Archive Privilege</AtelierButton>
          <AtelierButton variant="ghost">Client Concierge</AtelierButton>
          <AtelierButton variant="primary" size="sm">Small Tag</AtelierButton>
          <AtelierButton variant="primary" size="lg">Large Bespoke</AtelierButton>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-headline-md text-2xl text-[#1a0e1c] border-b border-[#1a0e1c]/15 pb-2">
          04 / Form Controls, Chips & Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <span className="font-label-code text-[10px] text-[#514534] uppercase block">
              Inputs & Validation
            </span>
            <AtelierInput
              label="Patron Identifier"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <AtelierInput
              label="Postal Code Checker"
              placeholder="e.g. 400001"
              error="Delivery restricted for this pincode"
            />
          </div>

          <div className="space-y-4">
            <span className="font-label-code text-[10px] text-[#514534] uppercase block">
              Checkboxes & Diamond Radios
            </span>
            <div className="space-y-3">
              <AtelierCheckbox
                label="Complimentary Royal Gift Wrapping"
                checked={checkboxState}
                onChange={setCheckboxState}
              />
              <div className="space-y-2 pt-2">
                <AtelierRadio
                  label="Standard White-Glove (3-5 Days)"
                  checked={radioState === 'option-1'}
                  onChange={() => setRadioState('option-1')}
                  name="shipping"
                />
                <AtelierRadio
                  label="Express Same-Day Courier (Mumbai / NCR)"
                  checked={radioState === 'option-2'}
                  onChange={() => setRadioState('option-2')}
                  name="shipping"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="font-label-code text-[10px] text-[#514534] uppercase block">
              Filter Chips & Swatch Badges
            </span>
            <div className="flex flex-wrap gap-2">
              <AtelierChip
                label="Raw Silk"
                selected={activeChip === 'raw-silk'}
                onClick={() => setActiveChip('raw-silk')}
                count={24}
              />
              <AtelierChip
                label="Chanderi"
                selected={activeChip === 'chanderi'}
                onClick={() => setActiveChip('chanderi')}
                count={18}
              />
              <AtelierChip
                label="Brocade"
                selected={activeChip === 'brocade'}
                onClick={() => setActiveChip('brocade')}
                count={12}
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <AtelierBadge label="LIMITED ATELIER" variant="verdigris" />
              <AtelierBadge label="RUNWAY EDIT" variant="vermilion" />
              <AtelierBadge label="VIP EXCLUSIVE" variant="saffron" />
              <AtelierBadge label="HERITAGE" variant="ink" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-headline-md text-2xl text-[#1a0e1c] border-b border-[#1a0e1c]/15 pb-2">
          05 / Drawers, Modals & Skeletons
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <AtelierButton variant="secondary" onClick={() => setModalOpen(true)}>
            Open Swatch Modal
          </AtelierButton>
          <AtelierButton variant="secondary" onClick={() => setDrawerOpen(true)}>
            Open Sliding Panel
          </AtelierButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <AtelierSkeleton isSwatch className="h-48 w-full" />
          <div className="space-y-3">
            <AtelierSkeleton className="h-6 w-3/4" />
            <AtelierSkeleton className="h-4 w-full" />
            <AtelierSkeleton className="h-4 w-5/6" />
            <AtelierSkeleton className="h-10 w-1/2" />
          </div>
        </div>

        <AtelierModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Atelier Specimen Dimensions"
        >
          <div className="space-y-3 text-xs">
            <p className="text-[#514534]">
              Each specimen is tailored to the precision tolerances specified in the Novuria
              Atelier cutting folios. Custom measurements are verified by our master cutters.
            </p>
            <AtelierButton
              variant="primary"
              className="w-full mt-4"
              onClick={() => setModalOpen(false)}
            >
              Acknowledge Specifications
            </AtelierButton>
          </div>
        </AtelierModal>

        <AtelierDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Sovereign Filter Rail"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#514534]">
              Select weave, silhouette, and ceremonial occasion.
            </p>
            <div className="flex flex-wrap gap-2">
              <AtelierChip label="Tissue Organza" selected />
              <AtelierChip label="Pure Katan" />
              <AtelierChip label="Matka Silk" />
            </div>
            <AtelierButton
              variant="primary"
              className="w-full mt-6"
              onClick={() => setDrawerOpen(false)}
            >
              Apply Filter Selection
            </AtelierButton>
          </div>
        </AtelierDrawer>
      </section>
    </div>
  );
}

