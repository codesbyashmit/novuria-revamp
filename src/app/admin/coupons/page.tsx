'use client';

import React, { useCallback, useEffect, useState } from 'react';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierInput from '@/components/ui/AtelierInput';
import AtelierModal from '@/components/ui/AtelierModal';

interface CouponItem {
  id: string;
  code: string;
  description?: string | null;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minOrderPaise: number;
  maxDiscountPaise?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [discountValue, setDiscountValue] = useState('10');
  const [minOrderRupees, setMinOrderRupees] = useState('5000');

  const fetchCoupons = useCallback(() => {
    fetch('/api/admin/coupons')
      .then((res) => res.json())
      .then((data) => {
        if (data.coupons) setCoupons(data.coupons);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  async function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    const val = parseInt(discountValue, 10);
    const minPaise = Math.round(parseFloat(minOrderRupees || '0') * 100);

    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        description,
        discountType,
        discountValue: val,
        minOrderPaise: minPaise,
        isActive: true,
      }),
    });

    if (res.ok) {
      setModalOpen(false);
      setCode('');
      setDescription('');
      fetchCoupons();
      setFeedback('Promotion code activated');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2C1810]">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5B869] block mb-1">
            Privilege Inscriptions &amp; Offers
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Coupons &amp; Offers</h1>
        </div>

        <AtelierButton variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          Create Privilege Code
        </AtelierButton>
      </div>

      {feedback && (
        <div className="border border-[#E5B869] bg-[#E5B869]/10 p-3 text-xs font-mono text-[#E5B869]">
          {feedback}
        </div>
      )}

      <div className="border border-[#2C1810] bg-[#1A0E1C] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#F5EFE6]/40 uppercase tracking-widest">
            Querying active promotions...
          </div>
        ) : coupons.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2C1810] text-[#F5EFE6]/40 uppercase tracking-wider bg-[#241326]">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Benefit</th>
                  <th className="py-3 px-4">Min Order</th>
                  <th className="py-3 px-4">Redemptions</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2C1810]/60">
                {coupons.map((c) => (
                  <tr key={c.id} className="text-[#F5EFE6] hover:bg-[#2C1810]/40 transition-colors">
                    <td className="py-3 px-4 text-[#E5B869] font-bold tracking-wider">{c.code}</td>
                    <td className="py-3 px-4">
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}% Off`
                        : `₹${Math.round(c.discountValue / 100)} Off`}
                    </td>
                    <td className="py-3 px-4 text-[#F5EFE6]/60">
                      ₹{Math.round(c.minOrderPaise / 100)}
                    </td>
                    <td className="py-3 px-4">{c.usedCount} used</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] uppercase ${c.isActive ? 'bg-[#1E6B62]/20 text-[#A5EDE1]' : 'bg-[#D8371F]/20 text-[#FF8F7A]'}`}>
                        {c.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center space-y-4">
            <p className="font-serif text-lg text-[#F5EFE6]">No Active Privilege Codes</p>
            <p className="text-xs font-mono text-[#F5EFE6]/60 max-w-md mx-auto">
              Create seasonal privilege codes (e.g. FIRST10, GUILDVIP) with min order thresholds and usage caps.
            </p>
          </div>
        )}
      </div>

      <AtelierModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Privilege Inscription"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <AtelierInput
            label="Privilege Code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="GUILD10"
            required
          />

          <AtelierInput
            label="Offer Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Patron welcoming privilege code"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#514534] mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed_amount')}
                className="w-full bg-[#EDE8EE]/40 border border-[#1A0E1C]/40 px-3 py-2 text-xs text-[#241726] focus:outline-none focus:border-[#E6A117]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed_amount">Fixed Amount (Paise)</option>
              </select>
            </div>

            <AtelierInput
              label={discountType === 'percentage' ? 'Percentage (e.g. 10)' : 'Amount in Paise'}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              required
            />
          </div>

          <AtelierInput
            label="Minimum Order Spend (INR ₹)"
            value={minOrderRupees}
            onChange={(e) => setMinOrderRupees(e.target.value)}
            placeholder="5000"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[#2C1810]">
            <AtelierButton variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </AtelierButton>
            <AtelierButton variant="primary">
              Authorize Code
            </AtelierButton>
          </div>
        </form>
      </AtelierModal>
    </div>
  );
}
