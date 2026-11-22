'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierInput from '@/components/ui/AtelierInput';
import AtelierModal from '@/components/ui/AtelierModal';

interface ModuleItem {
  id: string;
  moduleKey: string;
  title: string;
  displayOrder: number;
  isEnabled: boolean;
}

interface HeroSlideItem {
  id: string;
  title: string;
  subtitle?: string | null;
  italicAccent?: string | null;
  eyebrowTag?: string | null;
  imageUrl: string;
  ctaText?: string | null;
  ctaLink?: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface AdSlotItem {
  id: string;
  slotKey: string;
  name: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  code?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  buttonText?: string | null;
  priority: number;
  deviceTarget: string;
  isActive: boolean;
}

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<'modules' | 'hero' | 'ads'>('modules');
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>([]);
  const [adSlots, setAdSlots] = useState<AdSlotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroItalic, setHeroItalic] = useState('');
  const [heroEyebrow, setHeroEyebrow] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('Explore Silk Curation');
  const [heroCtaLink, setHeroCtaLink] = useState('/catalogue');

  const [adModalOpen, setAdModalOpen] = useState(false);
  const [adSlotKey, setAdSlotKey] = useState('leaderboard');
  const [adName, setAdName] = useState('Top Leaderboard Strip');
  const [adTitle, setAdTitle] = useState('Complimentary white-glove delivery on all atelier orders');
  const [adButtonText, setAdButtonText] = useState('DISCOVER SERVICES');
  const [adLinkUrl, setAdLinkUrl] = useState('/concierge');

  const loadData = useCallback(() => {
    Promise.all([
      fetch('/api/admin/cms/modules').then((r) => r.json()),
      fetch('/api/admin/cms/hero-slides').then((r) => r.json()),
      fetch('/api/admin/cms/ad-slots').then((r) => r.json()),
    ])
      .then(([modData, heroData, adsData]) => {
        if (modData.modules) setModules(modData.modules);
        if (heroData.slides) setHeroSlides(heroData.slides);
        if (adsData.adSlots) setAdSlots(adsData.adSlots);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function moveModule(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    const newModules = [...modules];
    const temp = newModules[index];
    newModules[index] = newModules[targetIndex];
    newModules[targetIndex] = temp;

    const reordered = newModules.map((m, idx) => ({
      ...m,
      displayOrder: idx + 1,
    }));

    setModules(reordered);

    await fetch('/api/admin/cms/modules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modules: reordered.map((m) => ({
          id: m.id,
          displayOrder: m.displayOrder,
          isEnabled: m.isEnabled,
        })),
      }),
    });
    setFeedback('Module sequence updated in database');
  }

  async function toggleModule(id: string) {
    const updated = modules.map((m) =>
      m.id === id ? { ...m, isEnabled: !m.isEnabled } : m
    );
    setModules(updated);

    await fetch('/api/admin/cms/modules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modules: updated.map((m) => ({
          id: m.id,
          displayOrder: m.displayOrder,
          isEnabled: m.isEnabled,
        })),
      }),
    });
    setFeedback('Module visibility updated');
  }

  async function handleCreateHero(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/cms/hero-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: heroTitle,
        subtitle: heroSubtitle,
        italicAccent: heroItalic,
        eyebrowTag: heroEyebrow,
        imageUrl: heroImage,
        ctaText: heroCtaText,
        ctaLink: heroCtaLink,
        displayOrder: heroSlides.length + 1,
        isActive: true,
      }),
    });

    if (res.ok) {
      setHeroModalOpen(false);
      loadData();
      setFeedback('Hero slide published');
    }
  }

  async function handleCreateAd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/cms/ad-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slotKey: adSlotKey,
        name: adName,
        title: adTitle,
        buttonText: adButtonText,
        linkUrl: adLinkUrl,
        priority: 1,
        deviceTarget: 'all',
        isActive: true,
      }),
    });

    if (res.ok) {
      setAdModalOpen(false);
      loadData();
      setFeedback('Ad slot configured');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2C1810]">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5B869] block mb-1">
            Storefront Curation Engine
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Modular CMS &amp; Ad Slots</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === 'modules'
                ? 'bg-[#E5B869] text-[#1A0E1C] font-semibold'
                : 'border border-[#2C1810] bg-[#1A0E1C] text-[#F5EFE6]'
            }`}
          >
            Modules Sequence
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === 'hero'
                ? 'bg-[#E5B869] text-[#1A0E1C] font-semibold'
                : 'border border-[#2C1810] bg-[#1A0E1C] text-[#F5EFE6]'
            }`}
          >
            Hero Slides
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
              activeTab === 'ads'
                ? 'bg-[#E5B869] text-[#1A0E1C] font-semibold'
                : 'border border-[#2C1810] bg-[#1A0E1C] text-[#F5EFE6]'
            }`}
          >
            Ad Slots
          </button>
        </div>
      </div>

      {feedback && (
        <div className="border border-[#E5B869] bg-[#E5B869]/10 p-3 text-xs font-mono text-[#E5B869]">
          {feedback}
        </div>
      )}

      {activeTab === 'modules' && (
        <div className="border border-[#2C1810] bg-[#1A0E1C] overflow-hidden">
          <div className="p-4 border-b border-[#2C1810] bg-[#241326] flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#E5B869]">
              Reorderable Homepage Layout Blocks
            </span>
            <span className="text-xs font-mono text-[#F5EFE6]/60">
              {modules.length} Configured Sections
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs font-mono text-[#F5EFE6]/40 uppercase tracking-widest">
              Querying layout structure...
            </div>
          ) : (
            <div className="divide-y divide-[#2C1810]">
              {modules.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-4 flex items-center justify-between hover:bg-[#2C1810]/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#E5B869] w-6 text-center">
                      #{m.displayOrder}
                    </span>
                    <div>
                      <span className="font-sans font-medium text-sm text-[#F5EFE6] block">
                        {m.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#F5EFE6]/40">
                        key: {m.moduleKey}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleModule(m.id)}
                      className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider border transition-colors ${
                        m.isEnabled
                          ? 'border-[#1E6B62] bg-[#1E6B62]/20 text-[#A5EDE1]'
                          : 'border-[#2C1810] bg-[#241326] text-[#F5EFE6]/40'
                      }`}
                    >
                      {m.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>

                    <button
                      onClick={() => moveModule(idx, 'up')}
                      disabled={idx === 0}
                      className="px-2 py-1 border border-[#2C1810] bg-[#241326] text-[#F5EFE6] disabled:opacity-30 text-xs font-mono"
                    >
                      &uarr;
                    </button>
                    <button
                      onClick={() => moveModule(idx, 'down')}
                      disabled={idx === modules.length - 1}
                      className="px-2 py-1 border border-[#2C1810] bg-[#241326] text-[#F5EFE6] disabled:opacity-30 text-xs font-mono"
                    >
                      &darr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <AtelierButton variant="primary" size="sm" onClick={() => setHeroModalOpen(true)}>
              Add Hero Slide
            </AtelierButton>
          </div>

          <div className="border border-[#2C1810] bg-[#1A0E1C] overflow-hidden">
            {heroSlides.length > 0 ? (
              <div className="divide-y divide-[#2C1810]">
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#E5B869] uppercase block">{slide.eyebrowTag}</span>
                      <h3 className="font-serif text-lg text-[#F5EFE6]">{slide.title}</h3>
                      <p className="text-xs font-sans text-[#F5EFE6]/60">{slide.subtitle}</p>
                    </div>
                    <span className="text-xs font-mono text-[#E5B869] uppercase">
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center space-y-4">
                <p className="font-serif text-lg text-[#F5EFE6]">Zero Hero Slides Configured</p>
                <p className="text-xs font-mono text-[#F5EFE6]/60 max-w-md mx-auto">
                  Add hero slides with your CDN image URLs, typography accents, and CTA buttons to appear on the homepage.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <AtelierButton variant="primary" size="sm" onClick={() => setAdModalOpen(true)}>
              Configure Ad Slot
            </AtelierButton>
          </div>

          <div className="border border-[#2C1810] bg-[#1A0E1C] overflow-hidden">
            {adSlots.length > 0 ? (
              <div className="divide-y divide-[#2C1810]">
                {adSlots.map((slot) => (
                  <div key={slot.id} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#E5B869] uppercase block">
                        slot: {slot.slotKey} &bull; target: {slot.deviceTarget}
                      </span>
                      <h3 className="font-serif text-base text-[#F5EFE6]">{slot.title}</h3>
                      <p className="text-xs font-mono text-[#F5EFE6]/60">{slot.name}</p>
                    </div>
                    <span className="text-xs font-mono text-[#E5B869] uppercase">
                      {slot.isActive ? 'Live' : 'Paused'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center space-y-4">
                <p className="font-serif text-lg text-[#F5EFE6]">No Ad Slots Configured</p>
                <p className="text-xs font-mono text-[#F5EFE6]/60 max-w-md mx-auto">
                  Configure named ad slots (e.g. &quot;leaderboard&quot;, &quot;verdigris_suite&quot;, &quot;archive_sale&quot;) to bind editorial promotions to homepage grids.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <AtelierModal
        isOpen={heroModalOpen}
        onClose={() => setHeroModalOpen(false)}
        title="Add Editorial Hero Slide"
      >
        <form onSubmit={handleCreateHero} className="space-y-4">
          <AtelierInput
            label="Eyebrow Tag"
            value={heroEyebrow}
            onChange={(e) => setHeroEyebrow(e.target.value)}
            placeholder="AUTUMN / WINTER 2026"
          />
          <AtelierInput
            label="Hero Headline"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="SOVEREIGN SILKS"
            required
          />
          <AtelierInput
            label="Italic Accent Word"
            value={heroItalic}
            onChange={(e) => setHeroItalic(e.target.value)}
            placeholder="&amp; raw modern tailoring"
          />
          <AtelierInput
            label="Subtitle"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            placeholder="Curated drape work cut from loom-aged archival mulberry silk."
          />
          <AtelierInput
            label="Image URL"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            placeholder="https://storage.novuria.in/hero/slide1.jpg"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <AtelierInput
              label="CTA Button Text"
              value={heroCtaText}
              onChange={(e) => setHeroCtaText(e.target.value)}
            />
            <AtelierInput
              label="CTA Button Link"
              value={heroCtaLink}
              onChange={(e) => setHeroCtaLink(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2C1810]">
            <AtelierButton variant="secondary" onClick={() => setHeroModalOpen(false)}>
              Cancel
            </AtelierButton>
            <AtelierButton variant="primary">
              Publish Slide
            </AtelierButton>
          </div>
        </form>
      </AtelierModal>

      <AtelierModal
        isOpen={adModalOpen}
        onClose={() => setAdModalOpen(false)}
        title="Configure Named Ad Slot"
      >
        <form onSubmit={handleCreateAd} className="space-y-4">
          <AtelierInput
            label="Slot Key Identifier"
            value={adSlotKey}
            onChange={(e) => setAdSlotKey(e.target.value)}
            placeholder="leaderboard / verdigris_suite / archive_sale"
            required
          />
          <AtelierInput
            label="Slot Descriptive Name"
            value={adName}
            onChange={(e) => setAdName(e.target.value)}
            placeholder="Top Leaderboard Strip"
            required
          />
          <AtelierInput
            label="Display Headline"
            value={adTitle}
            onChange={(e) => setAdTitle(e.target.value)}
            placeholder="Complimentary white-glove delivery on all orders"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <AtelierInput
              label="Button Text"
              value={adButtonText}
              onChange={(e) => setAdButtonText(e.target.value)}
            />
            <AtelierInput
              label="Button Link URL"
              value={adLinkUrl}
              onChange={(e) => setAdLinkUrl(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#2C1810]">
            <AtelierButton variant="secondary" onClick={() => setAdModalOpen(false)}>
              Cancel
            </AtelierButton>
            <AtelierButton variant="primary">
              Save Slot
            </AtelierButton>
          </div>
        </form>
      </AtelierModal>
    </div>
  );
}
