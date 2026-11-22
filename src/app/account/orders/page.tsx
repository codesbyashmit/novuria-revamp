import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';
import AtelierPrice from '@/components/ui/AtelierPrice';
import AtelierButton from '@/components/ui/AtelierButton';
import { Package } from 'lucide-react';

export default async function AccountOrdersPage() {
  const user = await getCurrentUser();

  if (!user || !db) {
    return (
      <div className="min-h-screen bg-[#FFF7FA] text-[#241726]">
        <header className="border-b border-[#1A0E1C]/10 bg-white py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl tracking-[0.2em] uppercase text-[#1A0E1C]">
              Novuria
            </Link>
            <span className="font-mono text-xs uppercase tracking-widest text-[#7F5600]">
              Garment Acquisitions
            </span>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="bg-white p-8 border border-[#1A0E1C]/10 clip-swatch shadow-atelier relative space-y-4">
            <span className="punched-hole" />
            <h1 className="font-serif text-2xl uppercase tracking-tight text-[#1A0E1C]">
              Patron Authentication Required
            </h1>
            <p className="font-sans text-xs text-[#514534]">
              Sign in with your registered mobile phone number to inspect your order ledgers and delivery tracking.
            </p>
            <Link href="/login">
              <AtelierButton variant="primary" size="lg" className="w-full">
                Enter Atelier Inscription
              </AtelierButton>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const userOrders = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.userId, user.id))
    .orderBy(desc(schema.orders.createdAt));

  return (
    <div className="min-h-screen bg-[#FFF7FA] text-[#241726]">
      <header className="border-b border-[#1A0E1C]/10 bg-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-[0.2em] uppercase text-[#1A0E1C]">
            Novuria
          </Link>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-[#514534]">Patron: {user.name}</span>
            <Link href="/account/wishlist" className="text-[#7F5600] hover:underline uppercase">
              Wishlist
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 lg:px-8 py-10 space-y-8">
        <div className="pb-6 border-b border-[#1A0E1C]/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#7F5600] block mb-1">
              Patron Archive
            </span>
            <h1 className="font-serif text-3xl text-[#1A0E1C] uppercase tracking-tight">
              Garment Acquisitions
            </h1>
          </div>

          <Link href="/catalogue">
            <AtelierButton variant="secondary" size="sm">
              Discover New Specimens
            </AtelierButton>
          </Link>
        </div>

        {userOrders.length === 0 ? (
          <div className="bg-white border border-[#1A0E1C]/10 p-16 text-center clip-swatch shadow-atelier-sm space-y-4 relative">
            <span className="punched-hole" />
            <div className="w-16 h-16 bg-[#FFE7FC] clip-swatch-sm flex items-center justify-center mx-auto text-[#7F5600]">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl uppercase tracking-tight text-[#1A0E1C]">
              Zero Garment Acquisitions Recorded
            </h2>
            <p className="font-sans text-xs text-[#514534] max-w-md mx-auto">
              Your personal ledger is unoccupied. Explore handcrafted silks and sovereign tailoring to record your premier piece.
            </p>
            <Link href="/catalogue">
              <AtelierButton variant="primary" size="md">
                Explore The Atelier
              </AtelierButton>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((ord) => (
              <article
                key={ord.id}
                className="bg-white p-6 border border-[#1A0E1C]/10 clip-swatch shadow-atelier-sm relative space-y-4"
              >
                <span className="punched-hole" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A0E1C]/10">
                  <div>
                    <span className="font-mono text-[10px] text-[#837562] uppercase tracking-wider block">
                      Folio Inscription
                    </span>
                    <span className="font-mono text-base font-bold text-[#1A0E1C]">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs font-mono text-[#514534] ml-2">
                      ({ord.createdAt.toLocaleDateString('en-IN')})
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 font-mono text-xs uppercase font-bold bg-[#1C6960] text-white">
                      {ord.status.toUpperCase()}
                    </span>
                    <AtelierPrice amountInPaise={ord.totalAmountPaise} size="md" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="font-mono text-xs text-[#514534]">
                    Payment: <span className="uppercase font-bold text-[#1A0E1C]">{ord.paymentMethod}</span> ({ord.paymentStatus})
                  </div>

                  <Link href={`/order-confirmation/${ord.orderNumber}`}>
                    <AtelierButton variant="secondary" size="sm">
                      Inspect Receipt
                    </AtelierButton>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

