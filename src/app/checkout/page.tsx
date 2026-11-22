'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import AtelierPrice from '@/components/ui/AtelierPrice';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierInput from '@/components/ui/AtelierInput';
import AtelierRadio from '@/components/ui/AtelierRadio';
import { ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalPaise, refreshCart } = useCart();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  const [shippingMethod, setShippingMethod] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPincode = async (val: string) => {
    setPincode(val);
    if (/^\d{6}$/.test(val)) {
      try {
        const res = await fetch(`/api/pincode?code=${val}`);
        const data = await res.json();
        if (res.ok && data.serviceable) {
          setCity(data.city);
          setState(data.state);
          setPincodeStatus(data.estimateText);
        } else {
          setPincodeStatus(data.message || 'Serviceability pending');
        }
      } catch {
        setPincodeStatus(null);
      }
    } else {
      setPincodeStatus(null);
    }
  };

  const freeThresholdPaise = 500000;
  const standardShippingPaise = subtotalPaise >= freeThresholdPaise ? 0 : 25000;
  const expressShippingPaise = 50000;
  const shippingFeePaise = shippingMethod === 'STANDARD' ? standardShippingPaise : expressShippingPaise;
  const taxPaise = Math.round(subtotalPaise * 0.12);
  const grandTotalPaise = subtotalPaise + shippingFeePaise;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Your atelier bag is empty');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        fullName,
        phone,
        email,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        shippingMethodCode: shippingMethod,
        paymentMethod,
      };

      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await refreshCart();
        router.push(`/order-confirmation/${data.orderNumber}`);
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch {
      setError('Connection interrupted during checkout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7FA] text-[#241726]">
      <header className="border-b border-[#1A0E1C]/10 bg-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-[0.2em] uppercase text-[#1A0E1C]">
            Novuria
          </Link>
          <span className="font-mono text-xs uppercase tracking-widest text-[#7F5600] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1C6960]" />
            Secure Atelier Encryption
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-wider bg-[#F2DCF1] px-4 py-2 border border-[#1A0E1C]/10 mb-8 max-w-fit">
          <span className="text-[#514534]">01 Bag</span>
          <span className="text-[#837562]">—</span>
          <span className="font-bold text-[#1A0E1C]">02 Dispatch &amp; Address (Active)</span>
          <span className="text-[#837562]">—</span>
          <span className="text-[#514534]">03 Authentication</span>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-[#D8371F] bg-[#D8371F]/10 text-xs font-mono text-[#D8371F]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white p-6 border border-[#1A0E1C]/10 clip-swatch shadow-atelier-sm relative">
              <span className="punched-hole" />
              <h2 className="font-serif text-xl uppercase tracking-tight text-[#1A0E1C] mb-4 pb-2 border-b border-[#1A0E1C]/10">
                1. Patron Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AtelierInput
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Atelier Patron"
                  required
                />
                <AtelierInput
                  label="Contact Phone (+91)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
                <div className="sm:col-span-2">
                  <AtelierInput
                    label="Email (For Order Inscription &amp; Tracking)"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@domain.in"
                    required
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 border border-[#1A0E1C]/10 clip-swatch shadow-atelier-sm relative">
              <span className="punched-hole" />
              <h2 className="font-serif text-xl uppercase tracking-tight text-[#1A0E1C] mb-4 pb-2 border-b border-[#1A0E1C]/10">
                2. White-Glove Dispatch Destination
              </h2>

              <div className="space-y-4">
                <AtelierInput
                  label="Street Address / Residence"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="Apartment, Wing, Building Name"
                  required
                />
                <AtelierInput
                  label="Address Line 2 (Optional)"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Street / Landmark"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <AtelierInput
                      label="Postal Pincode"
                      value={pincode}
                      onChange={(e) => checkPincode(e.target.value)}
                      placeholder="110001"
                      required
                    />
                    {pincodeStatus && (
                      <span className="text-[10px] font-mono text-[#1C6960] block mt-1">
                        {pincodeStatus}
                      </span>
                    )}
                  </div>

                  <AtelierInput
                    label="City / District"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New Delhi"
                    required
                  />

                  <AtelierInput
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Delhi"
                    required
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 border border-[#1A0E1C]/10 clip-swatch shadow-atelier-sm relative">
              <span className="punched-hole" />
              <h2 className="font-serif text-xl uppercase tracking-tight text-[#1A0E1C] mb-4 pb-2 border-b border-[#1A0E1C]/10">
                3. Dispatch Cadence &amp; Payment
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#514534] block">
                    Dispatch Method
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setShippingMethod('STANDARD')}
                      className={`p-4 border cursor-pointer clip-swatch-sm transition-all ${
                        shippingMethod === 'STANDARD'
                          ? 'border-[#E6A117] bg-[#FFE7FC]'
                          : 'border-[#1A0E1C]/20 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-bold text-[#1A0E1C]">Standard White-Glove</span>
                        <span className="font-mono text-xs font-bold text-[#7F5600]">
                          {standardShippingPaise === 0 ? 'FREE' : '₹250'}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#514534] block mt-1">
                        3-5 business days insured courier
                      </span>
                    </div>

                    <div
                      onClick={() => setShippingMethod('EXPRESS')}
                      className={`p-4 border cursor-pointer clip-swatch-sm transition-all ${
                        shippingMethod === 'EXPRESS'
                          ? 'border-[#E6A117] bg-[#FFE7FC]'
                          : 'border-[#1A0E1C]/20 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-bold text-[#1A0E1C]">Priority Air Dispatch</span>
                        <span className="font-mono text-xs font-bold text-[#7F5600]">₹500</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#514534] block mt-1">
                        1-2 business days white-glove direct
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#1A0E1C]/10">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#514534] block">
                    Payment Gateway
                  </span>
                  <div className="space-y-2">
                    <AtelierRadio
                      name="paymentMethod"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      label="Razorpay Secure (UPI, Cards, Netbanking, Cred)"
                    />
                    <AtelierRadio
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      label="Cash on Delivery (Verified Pin Codes Only)"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 bg-white p-6 border border-[#1A0E1C]/10 clip-swatch shadow-atelier space-y-6 relative">
            <span className="punched-hole" />

            <h2 className="font-serif text-xl uppercase tracking-tight text-[#1A0E1C] pb-3 border-b border-[#1A0E1C]/10">
              Order Inscription
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-[#1A0E1C]/10">
              {items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex justify-between gap-2 text-xs">
                  <div>
                    <span className="font-serif text-[#1A0E1C] block font-bold truncate max-w-[180px]">
                      {item.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#514534]">
                      Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                    </span>
                  </div>
                  <AtelierPrice amountInPaise={item.lineTotalPaise} size="sm" />
                </div>
              ))}
            </div>

            <div className="space-y-3 font-mono text-xs text-[#514534] pt-4 border-t border-[#1A0E1C]/10">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <AtelierPrice amountInPaise={subtotalPaise} size="sm" />
              </div>

              <div className="flex justify-between">
                <span>WHITE-GLOVE DISPATCH</span>
                <span>{shippingFeePaise === 0 ? 'COMPLIMENTARY' : `₹${Math.round(shippingFeePaise / 100)}`}</span>
              </div>

              <div className="flex justify-between">
                <span>ESTIMATED TAX (GST 12%)</span>
                <span>₹{Math.round(taxPaise / 100)} (INCLUDED)</span>
              </div>

              <div className="flex justify-between font-bold text-[#1A0E1C] pt-3 border-t border-[#1A0E1C]/10 text-base">
                <span>TOTAL DUE</span>
                <AtelierPrice amountInPaise={grandTotalPaise} size="md" />
              </div>
            </div>

            <AtelierButton variant="primary" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Authorizing Inscription...' : 'Authorize Acquisition'}
            </AtelierButton>
          </aside>
        </form>
      </main>
    </div>
  );
}

