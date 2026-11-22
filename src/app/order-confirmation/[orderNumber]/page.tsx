import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import AtelierPrice from '@/components/ui/AtelierPrice';
import AtelierButton from '@/components/ui/AtelierButton';
import { Check, ShieldCheck } from 'lucide-react';

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  if (!db) notFound();

  const [order] = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.orderNumber, orderNumber))
    .limit(1);

  if (!order) notFound();

  const items = await db
    .select()
    .from(schema.orderItems)
    .where(eq(schema.orderItems.orderId, order.id));

  const address = order.shippingAddressSnapshot as Record<string, string>;

  return (
    <div className="min-h-screen bg-[#FFF7FA] text-[#241726]">
      <header className="border-b border-[#1A0E1C]/10 bg-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-[0.2em] uppercase text-[#1A0E1C]">
            Novuria
          </Link>
          <span className="font-mono text-xs uppercase tracking-widest text-[#7F5600] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1C6960]" />
            Acquisition Inscribed
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border border-[#1A0E1C]/10 p-8 sm:p-12 clip-swatch shadow-atelier relative space-y-8">
          <span className="punched-hole" />

          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#1C6960] text-white clip-swatch-sm flex items-center justify-center mx-auto shadow-atelier-sm">
              <Check className="w-8 h-8 text-white" />
            </div>

            <span className="font-mono text-xs text-[#7F5600] uppercase tracking-[0.25em] font-bold block">
              Folio Reference: {order.orderNumber}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl uppercase text-[#1A0E1C] tracking-tight">
              Acquisition Confirmed
            </h1>

            <p className="font-sans text-sm text-[#514534] max-w-lg mx-auto leading-relaxed">
              Your garments have been inscribed in the atelier production queue. White-glove artisans are curating your specimens for direct insured dispatch.
            </p>
          </div>

          <div className="bg-[#FFE7FC] p-4 clip-swatch-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#1A0E1C]/10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase text-[#1A0E1C]">
                Dispatch Status:
              </span>
              <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase bg-[#1C6960] text-white">
                {order.status.toUpperCase()}
              </span>
            </div>

            <div className="font-mono text-xs text-[#514534]">
              Payment: <span className="font-bold text-[#1A0E1C] uppercase">{order.paymentMethod}</span> ({order.paymentStatus})
            </div>
          </div>

          <div className="border-t border-[#1A0E1C]/10 pt-6 space-y-4">
            <h2 className="font-serif text-xl uppercase tracking-tight text-[#1A0E1C]">
              Inscribed Specimens
            </h2>

            <div className="divide-y divide-[#1A0E1C]/10">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex justify-between items-center gap-4">
                  <div>
                    <span className="font-mono text-[10px] text-[#1C6960] uppercase block">
                      {item.skuSnapshot}
                    </span>
                    <h3 className="font-serif text-base text-[#1A0E1C] font-bold">
                      {item.titleSnapshot}
                    </h3>
                    <div className="flex gap-3 text-xs font-mono text-[#514534] mt-1">
                      {item.sizeSnapshot && <span>Size: {item.sizeSnapshot}</span>}
                      {item.colorSnapshot && <span>Color: {item.colorSnapshot}</span>}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <AtelierPrice amountInPaise={item.subtotalPaise} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {address && (
            <div className="border-t border-[#1A0E1C]/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
              <div>
                <span className="text-[#837562] uppercase tracking-wider block mb-1">
                  Patron &amp; Delivery Destination
                </span>
                <p className="font-bold text-[#1A0E1C]">{address.fullName}</p>
                <p className="text-[#514534]">{address.addressLine1}</p>
                {address.addressLine2 && <p className="text-[#514534]">{address.addressLine2}</p>}
                <p className="text-[#514534]">
                  {address.city}, {address.state} — {address.pincode}
                </p>
                <p className="text-[#514534] mt-1">Phone: {address.phone}</p>
              </div>

              <div className="bg-[#FFF7FA] p-4 border border-[#1A0E1C]/10 space-y-2">
                <span className="text-[#837562] uppercase tracking-wider block mb-2">
                  Financial Settlement
                </span>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <AtelierPrice amountInPaise={order.subtotalPaise} size="sm" />
                </div>
                {order.discountPaise > 0 && (
                  <div className="flex justify-between text-[#1C6960]">
                    <span>Discount:</span>
                    <span>-₹{Math.round(order.discountPaise / 100)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{order.shippingPaise === 0 ? 'Complimentary' : `₹${Math.round(order.shippingPaise / 100)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-[#1A0E1C] pt-2 border-t border-[#1A0E1C]/10">
                  <span>Total Settled:</span>
                  <AtelierPrice amountInPaise={order.totalAmountPaise} size="sm" />
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-[#1A0E1C]/10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogue">
              <AtelierButton variant="primary" size="lg">
                Explore More Collections
              </AtelierButton>
            </Link>
            <Link href="/account/orders">
              <AtelierButton variant="secondary" size="lg">
                View In My Acquisitions
              </AtelierButton>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

