import { db } from '@/db';
import * as schema from '@/db/schema';
import Link from 'next/link';
import { count, desc } from 'drizzle-orm';
import AtelierButton from '@/components/ui/AtelierButton';
import AtelierPrice from '@/components/ui/AtelierPrice';

export default async function AdminDashboardPage() {
  if (!db) {
    return <div>Database offline</div>;
  }

  const [productsCountRes] = await db.select({ value: count() }).from(schema.products);
  const [variantsCountRes] = await db.select({ value: count() }).from(schema.productVariants);
  const [ordersCountRes] = await db.select({ value: count() }).from(schema.orders);
  const [couponsCountRes] = await db.select({ value: count() }).from(schema.coupons);
  const [pendingReviewsRes] = await db.select({ value: count() }).from(schema.reviews);

  const recentOrders = await db
    .select()
    .from(schema.orders)
    .orderBy(desc(schema.orders.createdAt))
    .limit(5);

  const stats = [
    { label: 'Catalogue Products', value: productsCountRes?.value ?? 0, href: '/admin/catalogue' },
    { label: 'Active Variants', value: variantsCountRes?.value ?? 0, href: '/admin/inventory' },
    { label: 'Acquisitions / Orders', value: ordersCountRes?.value ?? 0, href: '/admin/orders' },
    { label: 'Active Promotions', value: couponsCountRes?.value ?? 0, href: '/admin/coupons' },
    { label: 'Reviews Submitted', value: pendingReviewsRes?.value ?? 0, href: '/admin/reviews' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[#2C1810]">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#E5B869] block mb-1">
            Atelier Executive Control
          </span>
          <h1 className="font-serif text-3xl text-[#F5EFE6]">Operations Overview</h1>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/catalogue">
            <AtelierButton variant="primary" size="sm">Manage Catalogue</AtelierButton>
          </Link>
          <a href="/api/admin/catalogue/products/csv" download>
            <AtelierButton variant="secondary" size="sm">Export Catalogue CSV</AtelierButton>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-[#2C1810] bg-[#1A0E1C] p-5 hover:border-[#E5B869] transition-colors block"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5EFE6]/60 block mb-2">
              {stat.label}
            </span>
            <span className="font-mono text-3xl font-semibold text-[#E5B869]">
              {stat.value}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border border-[#2C1810] bg-[#1A0E1C] p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#2C1810]">
            <h2 className="font-serif text-lg text-[#F5EFE6]">Recent Acquisitions</h2>
            <Link href="/admin/orders" className="text-xs font-mono uppercase tracking-widest text-[#E5B869] hover:underline">
              All Orders
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2C1810] text-[#F5EFE6]/40 uppercase tracking-wider">
                    <th className="py-2.5">Order Number</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Total</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2C1810]/60">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="text-[#F5EFE6]">
                      <td className="py-3 font-mono text-[#E5B869]">{order.orderNumber}</td>
                      <td className="py-3">{order.guestEmail || order.guestPhone || 'Atelier Patron'}</td>
                      <td className="py-3">
                        <AtelierPrice amountInPaise={order.totalAmountPaise} size="sm" />
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 uppercase tracking-wider text-[10px] bg-[#2C1810] text-[#E5B869]">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-[#F5EFE6]/40 uppercase tracking-widest">
              Zero orders recorded. Store is active for patronage.
            </div>
          )}
        </div>

        <div className="border border-[#2C1810] bg-[#1A0E1C] p-6 space-y-4">
          <h2 className="font-serif text-lg text-[#F5EFE6] pb-4 border-b border-[#2C1810]">
            Atelier Tooling
          </h2>

          <div className="space-y-3">
            <Link
              href="/admin/catalogue"
              className="block p-3 border border-[#2C1810] hover:border-[#E5B869] transition-colors"
            >
              <span className="text-xs font-sans font-semibold text-[#F5EFE6] block">Catalogue Management</span>
              <span className="text-[10px] font-mono text-[#F5EFE6]/60">Curate garments, variants, and imagery.</span>
            </Link>

            <Link
              href="/admin/inventory"
              className="block p-3 border border-[#2C1810] hover:border-[#E5B869] transition-colors"
            >
              <span className="text-xs font-sans font-semibold text-[#F5EFE6] block">Inventory Adjustments</span>
              <span className="text-[10px] font-mono text-[#F5EFE6]/60">Audit logs and stock balance controls.</span>
            </Link>

            <Link
              href="/admin/cms"
              className="block p-3 border border-[#2C1810] hover:border-[#E5B869] transition-colors"
            >
              <span className="text-xs font-sans font-semibold text-[#F5EFE6] block">Modular CMS &amp; Banners</span>
              <span className="text-[10px] font-mono text-[#F5EFE6]/60">Reorder homepage rails and ad slots.</span>
            </Link>

            <Link
              href="/admin/pincodes"
              className="block p-3 border border-[#2C1810] hover:border-[#E5B869] transition-colors"
            >
              <span className="text-xs font-sans font-semibold text-[#F5EFE6] block">Serviceability Pincodes</span>
              <span className="text-[10px] font-mono text-[#F5EFE6]/60">Delivery zones and cash-on-delivery rules.</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

