'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Overview', href: '/admin' },
    { label: 'Catalogue', href: '/admin/catalogue' },
    { label: 'Inventory', href: '/admin/inventory' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'CMS & Ads', href: '/admin/cms' },
    { label: 'Coupons', href: '/admin/coupons' },
    { label: 'Reviews', href: '/admin/reviews' },
    { label: 'Pincodes', href: '/admin/pincodes' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-[#0F0814] text-[#F5EFE6]">
      <aside className="w-64 border-r border-[#2C1810] bg-[#1A0E1C] flex flex-col justify-between shrink-0">
        <div>
          <div className="h-20 flex items-center px-6 border-b border-[#2C1810]">
            <Link href="/admin" className="font-serif text-lg tracking-[0.2em] text-[#E5B869] uppercase font-normal">
              Novuria Atelier
            </Link>
          </div>

          <div className="px-6 py-3 border-b border-[#2C1810]/60 bg-[#241326]">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#E5B869]/80">Admin Console</span>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2.5 text-xs font-sans uppercase tracking-[0.15em] transition-colors ${
                    isActive
                      ? 'bg-[#E5B869] text-[#1A0E1C] font-semibold shadow-atelier-sm'
                      : 'text-[#F5EFE6]/70 hover:bg-[#2C1810] hover:text-[#F5EFE6]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#2C1810] space-y-2">
          <Link
            href="/"
            className="block text-center py-2 text-xs font-mono uppercase tracking-widest text-[#E5B869] hover:underline"
          >
            View Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full py-2 text-xs font-mono uppercase tracking-widest text-[#F5EFE6]/60 hover:text-[#D8371F] transition-colors text-center block"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-[#2C1810] bg-[#1A0E1C] flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#F5EFE6]/40 uppercase tracking-widest">Workspace</span>
            <span className="text-xs font-mono text-[#E5B869] uppercase tracking-wider">Production Operations</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[#F5EFE6]/80 uppercase tracking-wider">Atelier Principal</span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

