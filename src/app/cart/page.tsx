'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import AtelierPrice from '@/components/ui/AtelierPrice';
import AtelierButton from '@/components/ui/AtelierButton';
import { ArrowRight, Minus, Plus, ShieldCheck, Trash2 } from 'lucide-react';

export default function FullCartPage() {
  const { items, subtotalPaise, updateQuantity, removeItem, totalCount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscountPaise, setCouponDiscountPaise] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF7FA] text-[#241726]">
        <header className="border-b border-[#1A0E1C]/10 bg-white py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl tracking-[0.2em] uppercase text-[#1A0E1C]">
              Novuria
            </Link>
            <span className="font-mono text-xs uppercase tracking-widest text-[#7F5600]">
              Couture Specimen Atelier
            </span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white border border-[#1A0E1C]/10 p-12 clip-swatch shadow-atelier relative">
            <span className="punched-hole" />

            <div className="w-20 h-24 bg-[#F2DCF1] clip-swatch-sm flex flex-col items-center justify-center mx-auto mb-6 shadow-atelier-sm">
              <span className="font-mono text-xs text-[#514534] font-bold">NULL</span>
            </div>

            <div className="font-mono text-xs text-[#7F5600] uppercase tracking-[0.25em] mb-2 font-bold">
              Vault Status: 0 Items Reserved
            </div>

            <h1 className="font-serif text-3xl lg:text-4xl uppercase tracking-tight text-[#1A0E1C] mb-4">
              Your Bag Is Currently Untenanted
            </h1>

            <p className="font-sans text-sm text-[#514534] max-w-md mx-auto mb-8 leading-relaxed">
              Explore handcrafted silk heirlooms and limited capsule archives, or sign in to synchronize previously saved specimens across your personal devices.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <AtelierButton variant="primary" size="lg" className="w-full">
                  Sign In To Retrieve Archive
                </AtelierButton>
              </Link>
              <Link href="/catalogue" className="w-full sm:w-auto">
                <AtelierButton variant="secondary" size="lg" className="w-full">
                  Explore New Arrivals
                </AtelierButton>
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-[#1A0E1C]/10 text-left">
              <span className="font-mono text-xs uppercase tracking-wider text-[#514534] block text-center mb-6">
                Or Explore Accredited Atelier Categories
              </span>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Silk Co-Ords', href: '/category/co-ords' },
                  { name: 'Brocade Kurtas', href: '/category/kurtas' },
                  { name: 'Banarasi Sarees', href: '/category/sarees' },
                  { name: 'Tailored Trousers', href: '/category/bottoms' },
                ].map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="p-4 bg-[#FFF7FA] hover:bg-[#F2DCF1] transition-colors clip-swatch-sm flex items-center justify-between border border-[#1A0E1C]/10"
                  >
                    <span className="font-serif text-sm font-bold text-[#1A0E1C]">{cat.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#7F5600]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7FA] text-[#241726]">
      <header className="border-b border-[#1A0E1C]/10 bg-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-[0.2em] uppercase text-[#1A0E1C]">
            Novuria
          </Link>
          <span className="font-mono text-xs uppercase tracking-widest text-[#7F5600]">
            Atelier Folio // Specimen Retention Verified
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-8 border-b border-[#1A0E1C]/10">
          <div>
            <div className="font-mono text-xs text-[#7F5600] uppercase tracking-widest font-bold mb-1">
              Atelier Bag Review
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl uppercase text-[#1A0E1C]">
              Atelier Shopping Bag{' '}
              <span className="font-mono text-sm text-[#1C6960] tracking-wider align-middle ml-2">
                ({totalCount} Specimens)
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-wider bg-[#F2DCF1] px-4 py-2 border border-[#1A0E1C]/10">
            <span className="font-bold text-[#1A0E1C]">01 Bag (Active)</span>
            <span className="text-[#837562]">—</span>
            <span className="text-[#514534]/60">02 Dispatch &amp; Address</span>
            <span className="text-[#837562]">—</span>
            <span className="text-[#514534]/60">03 Authentication</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-4 border border-[#1A0E1C]/10 shadow-atelier-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-[#1C6960] font-bold uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1C6960]" />
                  {remainingPaise === 0
                    ? 'Complimentary White-Glove Dispatch Unlocked'
                    : 'White-Glove Express Dispatch'}
                </span>
                <span className="font-mono text-xs font-bold text-[#1A0E1C]">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-[#E9D3E8] h-1.5 overflow-hidden">
                <div
                  className="bg-[#E6A117] h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="font-sans text-xs text-[#514534] mt-2">
                {remainingPaise === 0 ? (
                  'All specimens qualify for direct insured courier dispatch from our master ateliers.'
                ) : (
                  <>
                    Add ₹{Math.round(remainingPaise / 100).toLocaleString('en-IN')} more to unlock complimentary white-glove shipping.
                  </>
                )}
              </p>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="bg-white p-6 border border-[#1A0E1C]/10 clip-swatch shadow-atelier-sm flex flex-col sm:flex-row gap-6 relative"
                >
                  <span className="punched-hole" />

                  <div className="w-28 h-36 shrink-0 bg-[#F2DCF1] clip-swatch-sm overflow-hidden border border-[#1A0E1C]/10">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#E9D3E8]" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="font-mono text-[10px] text-[#1C6960] tracking-widest uppercase block">
                            {item.sku || 'SPECIMEN ID'}
                          </span>
                          <h2 className="font-serif text-xl text-[#1A0E1C] mt-0.5">
                            {item.name}
                          </h2>
                        </div>
                        <AtelierPrice amountInPaise={item.lineTotalPaise} size="md" />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 font-mono text-xs text-[#514534]">
                        {item.size && (
                          <div className="bg-[#FFF7FA] px-2 py-1 border border-[#1A0E1C]/10">
                            <span className="text-[10px] text-[#837562] block">SIZE</span>
                            <span className="font-bold text-[#1A0E1C]">{item.size}</span>
                          </div>
                        )}
                        {item.color && (
                          <div className="bg-[#FFF7FA] px-2 py-1 border border-[#1A0E1C]/10">
                            <span className="text-[10px] text-[#837562] block">SHADE</span>
                            <span className="font-bold text-[#1A0E1C]">{item.color}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1A0E1C]/10">
                      <div className="flex items-center border border-[#1A0E1C]/30 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#FFF7FA] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 text-[#1A0E1C]" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-bold text-[#1A0E1C]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#FFF7FA] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 text-[#1A0E1C]" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-wider">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-[#D8371F] hover:underline"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 bg-white p-6 border border-[#1A0E1C]/10 clip-swatch shadow-atelier space-y-6 relative">
            <span className="punched-hole" />

            <h2 className="font-serif text-xl uppercase tracking-tight text-[#1A0E1C] pb-3 border-b border-[#1A0E1C]/10">
              Folio Summary
            </h2>

            <form onSubmit={applyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="PRIVILEGE CODE"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-[#FFF7FA] border border-[#1A0E1C]/30 px-3 py-2 font-mono text-xs uppercase tracking-wider outline-none focus:border-[#E6A117]"
              />
              <AtelierButton variant="secondary" size="sm" disabled={validatingCoupon}>
                {validatingCoupon ? '...' : 'Apply'}
              </AtelierButton>
            </form>

            {couponMessage && (
              <p className={`font-mono text-xs ${couponDiscountPaise > 0 ? 'text-[#1C6960]' : 'text-[#D8371F]'}`}>
                {couponMessage}
              </p>
            )}

            <div className="space-y-3 font-mono text-xs text-[#514534] pt-4 border-t border-[#1A0E1C]/10">
              <div className="flex justify-between">
                <span>SPECIMEN SUBTOTAL</span>
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

              <div className="flex justify-between font-bold text-[#1A0E1C] pt-3 border-t border-[#1A0E1C]/10 text-base">
                <span>TOTAL ACQUISITION</span>
                <AtelierPrice amountInPaise={finalTotalPaise} size="md" />
              </div>

              <span className="text-[10px] text-[#837562] block text-center pt-2">
                Inclusive of all taxes (Apparel GST 12%)
              </span>
            </div>

            <Link href="/checkout" className="block pt-2">
              <AtelierButton variant="primary" size="lg" className="w-full">
                Proceed To Checkout
              </AtelierButton>
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}

