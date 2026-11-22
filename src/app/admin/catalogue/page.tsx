'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierInput from '@/components/ui/AtelierInput';
import AtelierModal from '@/components/ui/AtelierModal';
import AtelierPrice from '@/components/ui/AtelierPrice';

interface Variant {
  id?: string;
  sku: string;
  color: string;
  colorHex?: string;
  size: string;
  pricePaise: number;
  initialStock: number;
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  basePricePaise: number;
  sku?: string | null;
  badges?: string[] | null;
  variants: Variant[];
  images: { id: string; imageUrl: string; isPrimary: boolean }[];
}

export default function AdminCataloguePage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [priceRupees, setPriceRupees] = useState('');
  const [sku, setSku] = useState('');
  const [badge, setBadge] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [color, setColor] = useState('Mulberry');
  const [size, setSize] = useState('M');
  const [stock, setStock] = useState('10');

  const fetchProducts = useCallback(() => {
    fetch('/api/admin/catalogue/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    const parsedPriceRupees = parseFloat(priceRupees);
    if (isNaN(parsedPriceRupees) || parsedPriceRupees <= 0) {
      setFeedback('Valid price required');
      return;
    }

    const basePricePaise = Math.round(parsedPriceRupees * 100);

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      basePricePaise,
      sku: sku || `${slug.toUpperCase()}-STD`,
      badges: badge ? [badge] : [],
      variants: [
        {
          sku: `${sku || slug.toUpperCase()}-${color.toUpperCase()}-${size.toUpperCase()}`,
          color,
          size,
          pricePaise: basePricePaise,
          initialStock: parseInt(stock, 10) || 0,
        },
      ],
      images: imageUrl
        ? [
            {
              imageUrl,
              altText: name,
              isPrimary: true,
              displayOrder: 0,
            },
          ]
        : [],
    };

    const res = await fetch('/api/admin/catalogue/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setModalOpen(false);
      resetForm();
      fetchProducts();
      setFeedback('Garment inscribed into catalogue');
    } else {
      const err = await res.json();
      setFeedback(err.error || 'Failed to save product');
    }
  }

  function resetForm() {
    setName('');
    setSlug('');
    setDescription('');
    setPriceRupees('');
    setSku('');
    setBadge('');
    setImageUrl('');
    setColor('Mulberry');
    setSize('M');
    setStock('10');
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setFeedback(null);
    try {
      const text = await file.text();
      const res = await fetch('/api/admin/catalogue/products/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text,
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback(`Imported ${data.count} catalogue entries`);
        fetchProducts();
      } else {
        setFeedback(data.error || 'CSV import failed');
      }
    } catch {
      setFeedback('Error parsing CSV file');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2C1810]">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5B869] block mb-1">
            Garment Inscriptions
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Catalogue Registry</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer">
            <span className="inline-block px-4 py-2 border border-[#2C1810] bg-[#1A0E1C] hover:border-[#E5B869] text-xs font-mono uppercase tracking-widest text-[#F5EFE6] transition-colors">
              {importing ? 'Importing CSV...' : 'Import CSV'}
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
              disabled={importing}
            />
          </label>

          <a href="/api/admin/catalogue/products/csv" download>
            <AtelierButton variant="secondary" size="sm">Export CSV</AtelierButton>
          </a>

          <AtelierButton variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            Add New Garment
          </AtelierButton>
        </div>
      </div>

      {feedback && (
        <div className="border border-[#E5B869] bg-[#E5B869]/10 p-3 text-xs font-mono text-[#E5B869]">
          {feedback}
        </div>
      )}

      <div className="border border-[#2C1810] bg-[#1A0E1C] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#F5EFE6]/40 uppercase tracking-widest">
            Querying catalogue registry...
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2C1810] text-[#F5EFE6]/40 uppercase tracking-wider bg-[#241326]">
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Variants</th>
                  <th className="py-3 px-4">Badges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2C1810]/60">
                {products.map((p) => (
                  <tr key={p.id} className="text-[#F5EFE6] hover:bg-[#2C1810]/40 transition-colors">
                    <td className="py-3 px-4 font-sans font-medium text-[#F5EFE6]">
                      {p.name}
                      {p.sku && <span className="block text-[10px] font-mono text-[#F5EFE6]/40">{p.sku}</span>}
                    </td>
                    <td className="py-3 px-4 text-[#F5EFE6]/60">{p.slug}</td>
                    <td className="py-3 px-4">
                      <AtelierPrice amountInPaise={p.basePricePaise} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#2C1810] text-[#E5B869] text-[10px]">
                        {p.variants.length} variant{p.variants.length === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.badges?.map((b) => (
                        <span key={b} className="px-2 py-0.5 bg-[#E5B869]/20 text-[#E5B869] text-[10px] uppercase mr-1">
                          {b}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center space-y-4">
            <p className="font-serif text-lg text-[#F5EFE6]">Atelier Vault Is Clean</p>
            <p className="text-xs font-mono text-[#F5EFE6]/60 max-w-md mx-auto">
              No garments currently inscribed. Use &quot;Add New Garment&quot; or &quot;Import CSV&quot; to populate your database with real atelier pieces.
            </p>
          </div>
        )}
      </div>

      <AtelierModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Inscribe New Atelier Garment"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <AtelierInput
            label="Garment Title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mulberry Raw Silk Co-ord Set"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <AtelierInput
              label="URL Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="mulberry-raw-silk-coord-set"
            />
            <AtelierInput
              label="Base Price (INR ₹)"
              value={priceRupees}
              onChange={(e) => setPriceRupees(e.target.value)}
              placeholder="24500"
              required
            />
          </div>

          <AtelierInput
            label="Garment Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Handcrafted silk tailoring with artisanal threadwork."
          />

          <div className="grid grid-cols-2 gap-4">
            <AtelierInput
              label="Base SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="NV-SLK-001"
            />
            <AtelierInput
              label="Editorial Badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Atelier Highlight"
            />
          </div>

          <div className="border-t border-[#2C1810] pt-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5B869] block mb-2">
              Primary Specimen Variant
            </span>
            <div className="grid grid-cols-3 gap-3">
              <AtelierInput
                label="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <AtelierInput
                label="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
              <AtelierInput
                label="Initial Stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <AtelierInput
            label="Primary Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://storage.novuria.in/couture/item1.jpg"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[#2C1810]">
            <AtelierButton variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </AtelierButton>
            <AtelierButton variant="primary">
              Inscribe Garment
            </AtelierButton>
          </div>
        </form>
      </AtelierModal>
    </div>
  );
}
