'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import AtelierPrice from '@/components/ui/AtelierPrice';
import AtelierButton from '@/components/ui/AtelierButton';
import { Minus, Plus, Trash2, X, ShieldCheck } from 'lucide-react';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotalPaise, totalCount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountPaise, setCouponDiscountPaise] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  if (!isOpen) return null;

  const freeThresholdPaise = 500000;
  const progressPercent = Math.min(100, Math.round((subtotalPaise / freeThresholdPaise) * 100));
  const remainingPaise = Math.max(0, freeThresholdPaise - subtotalPaise);

  const applyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    setCouponMessage(null);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotalPaise }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponDiscountPaise(data.discountPaise);
        setCouponMessage(data.message);
      } else {
        setCouponDiscountPaise(0);
        setCouponMessage(data.message || 'Invalid privilege code');
      }
    } catch {
      setCouponMessage('Error validating privilege code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const finalTotalPaise = Math.max(0, subtotalPaise - couponDiscountPaise);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div
        className="fixed inset-0 bg-[#1A0E1C]/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      <aside className="fixed top-0 right-0 z-50 w-full max-w-[440px] h-screen bg-[#FFF7FA] text-[#241726] flex flex-col shadow-2xl transition-transform duration-300 ease-out border-l border-[#1A0E1C]/15">
        <div className="p-6 bg-[#FFF7FA] flex flex-col gap-3 border-b border-[#1A0E1C]/10 relative">
          <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[#837562]/60 pointer-events-none" />

          <div className="flex items-center justify-between pt-1 pl-4">
            <div className="flex items-baseline gap-2">
              <h2 className="font-serif text-2xl text-[#241726] tracking-tight uppercase">
                Your Bag
              </h2>
              <span className="font-mono text-xs text-[#E6A117] font-bold">
                ({String(totalCount).padStart(2, '0')})
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="clip-swatch-sm bg-[#F2DCF1] hover:bg-[#1A0E1C] hover:text-[#FFF7FA] text-[#241726] w-9 h-9 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close Bag Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 bg-[#FFE7FC] p-3 clip-swatch-sm relative">
            <div className="flex items-center justify-between mb-1.5 text-[#241726]">
              <span className="font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-[#7F5600] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1C6960]" />
                White-Glove Dispatch
              </span>
              <span className="font-mono text-[11px] text-[#241726] font-bold">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#E9D3E8] overflow-hidden">
              <div
                className="h-full bg-[#E6A117] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="font-sans text-xs text-[#514534] mt-1.5 leading-snug">
              {remainingPaise === 0 ? (
                <span className="text-[#1C6960] font-bold">
                  Complimentary white-glove express delivery unlocked.
                </span>
              ) : (
                <>
                  Add{' '}
                  <span className="font-mono font-bold text-[#241726]">
                    ₹{Math.round(remainingPaise / 100).toLocaleString('en-IN')}
                  </span>{' '}
                  more for complimentary insured dispatch.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 divide-y divide-[#1A0E1C]/10">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-20 bg-[#F2DCF1] clip-swatch-sm flex flex-col items-center justify-center mx-auto shadow-atelier-sm">
                <span className="font-mono text-xs text-[#514534] font-bold">NULL</span>
              </div>
              <h3 className="font-serif text-lg text-[#241726] uppercase tracking-tight">
                Your Bag Is Currently Untenanted
              </h3>
              <p className="font-sans text-xs text-[#514534] max-w-xs mx-auto">
                Explore sovereign silks, handspun weaves, and raw modern tailoring to begin your collection.
              </p>
              <Link href="/catalogue" onClick={() => setIsOpen(false)}>
                <AtelierButton variant="primary" size="sm" className="mt-2">
                  Explore Specimens
                </AtelierButton>
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <article key={item.id} className="pt-4 first:pt-0 flex gap-4 group relative">
                <div className="w-20 h-28 shrink-0 bg-[#F2DCF1] clip-swatch-sm relative overflow-hidden border border-[#1A0E1C]/10">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#E9D3E8]" />
                  )}
                  <span className="punched-hole" />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <span className="font-mono text-[10px] text-[#1C6960] tracking-widest uppercase block">
                      {item.sku || 'SPECIMEN'}
                    </span>
                    <h3 className="font-serif text-base text-[#241726] leading-tight truncate mt-0.5">
                      {item.name}
                    </h3>

                    <div className="flex flex-wrap gap-2 mt-2 font-mono text-[10px] text-[#514534]">
                      {item.size && (
                        <span className="bg-[#FFE7FC] px-1.5 py-0.5 border border-[#1A0E1C]/10">
                          SIZE: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="bg-[#FFE7FC] px-1.5 py-0.5 border border-[#1A0E1C]/10">
                          {item.color}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#1A0E1C]/5">
                    <div className="flex items-center border border-[#1A0E1C]/20 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-[#FFE7FC] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 text-[#241726]" />
                      </button>
                      <span className="w-7 text-center font-mono text-xs font-bold text-[#241726]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-[#FFE7FC] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 text-[#241726]" />
                      </button>
                    </div>

                    <AtelierPrice amountInPaise={item.lineTotalPaise} size="sm" />

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[#837562] hover:text-[#D8371F] transition-colors p-1"
                      aria-label="Remove specimen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-[#FFF7FA] border-t border-[#1A0E1C]/10 space-y-4">
            <form onSubmit={applyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="PRIVILEGE CODE"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-white border border-[#1A0E1C]/30 px-3 py-2 font-mono text-xs uppercase tracking-wider outline-none focus:border-[#E6A117]"
              />
              <AtelierButton variant="secondary" size="sm" disabled={validatingCoupon}>
                {validatingCoupon ? 'Validating...' : 'Inscribe'}
              </AtelierButton>
            </form>

            {couponMessage && (
              <p className={`font-mono text-[11px] ${couponDiscountPaise > 0 ? 'text-[#1C6960]' : 'text-[#D8371F]'}`}>
                {couponMessage}
              </p>
            )}

            <div className="space-y-2 text-xs font-mono text-[#514534] pt-2 border-t border-[#1A0E1C]/10">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <AtelierPrice amountInPaise={subtotalPaise} size="sm" />
              </div>

              {couponDiscountPaise > 0 && (
                <div className="flex justify-between text-[#1C6960]">
                  <span>PRIVILEGE DEDUCTION</span>
                  <span>-₹{Math.round(couponDiscountPaise / 100).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>WHITE-GLOVE DISPATCH</span>
                <span>{subtotalPaise >= freeThresholdPaise ? 'COMPLIMENTARY' : '₹250'}</span>
              </div>

              <div className="flex justify-between font-bold text-[#241726] pt-2 border-t border-[#1A0E1C]/10 text-sm">
                <span>ESTIMATED TOTAL</span>
                <AtelierPrice amountInPaise={finalTotalPaise} size="md" />
              </div>

              <span className="text-[10px] text-[#837562] block text-center pt-1">
                Inclusive of all taxes (Apparel GST 12%)
              </span>
            </div>

            <Link href="/checkout" onClick={() => setIsOpen(false)} className="block">
              <AtelierButton variant="primary" size="lg" className="w-full">
                Proceed To Atelier Checkout
              </AtelierButton>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
