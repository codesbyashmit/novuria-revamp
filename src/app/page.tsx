import Link from 'next/link';
import {
  ShoppingBag,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  const isDbConfigured = Boolean(process.env.DATABASE_URL);

  const sampleProducts = [
    {
      id: '1',
      name: 'Novuria ANC Wireless Headphones',
      category: 'Electronics & Audio',
      price: '$249.99',
      comparePrice: '$299.99',
      badge: 'Best Seller',
      description: 'Studio-grade active noise cancellation with 40h battery & spatial audio.',
    },
    {
      id: '2',
      name: 'Heavyweight Oversized Hoodie',
      category: 'Apparel & Streetwear',
      price: '$89.00',
      comparePrice: '$110.00',
      badge: 'New Arrival',
      description: '450 GSM luxury French Terry cotton with minimalist embroidered branding.',
    },
    {
      id: '3',
      name: 'Solid American Walnut Desk Shelf',
      category: 'Home & Workspace',
      price: '$135.00',
      comparePrice: null,
      badge: 'Crafted',
      description: 'Handcrafted solid natural walnut monitor riser with anodized aluminum legs.',
    },
  ];

  const categories = [
    { name: 'Electronics & Audio', count: '14 items', slug: 'electronics-audio' },
    { name: 'Apparel & Streetwear', count: '28 items', slug: 'apparel-streetwear' },
    { name: 'Home & Workspace', count: '19 items', slug: 'home-workspace' },
    { name: 'Accessories', count: '32 items', slug: 'accessories' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* Top Notification / DB Status Bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                isDbConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-zinc-400">
              Database:{' '}
              <strong className={isDbConfigured ? 'text-emerald-400' : 'text-amber-400'}>
                {isDbConfigured ? 'Neon PostgreSQL Connected' : 'Awaiting DATABASE_URL in .env.local'}
              </strong>
            </span>
          </div>
          <Link
            href="/api/health"
            className="flex items-center gap-1 font-mono text-zinc-400 transition hover:text-zinc-200"
            target="_blank"
          >
            <span>/api/health</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-widest text-white">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NOVURIA
              </span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
              <Link href="#products" className="transition hover:text-white">
                Products
              </Link>
              <Link href="#categories" className="transition hover:text-white">
                Categories
              </Link>
              <Link href="#stack" className="transition hover:text-white">
                Tech Stack
              </Link>
              <Link href="#dev" className="transition hover:text-white">
                Dev Environment
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            >
              <ShoppingBag className="h-4 w-4 text-indigo-400" />
              <span>Cart</span>
              <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-800 py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1 text-xs text-zinc-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Next.js 15 &bull; Drizzle ORM &bull; Neon PostgreSQL</span>
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Next-Generation <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
              E-Commerce Experience
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg">
            High performance, type-safe full-stack online storefront. Engineered with serverless
            Postgres edge scaling, modern Drizzle ORM migrations, and seamless responsive design.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#dev"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800"
            >
              <Terminal className="h-4 w-4 text-zinc-400" />
              <span>Dev Environment Guide</span>
            </a>
          </div>
        </div>
      </section>

      {/* Tech Stack Pillars */}
      <section id="stack" className="border-b border-zinc-800 bg-zinc-900/30 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6 transition hover:border-zinc-700">
              <Zap className="h-8 w-8 text-indigo-400" />
              <h3 className="mt-4 font-semibold text-white">Next.js & React</h3>
              <p className="mt-2 text-xs text-zinc-400">
                App Router, Server Components, Fast Refresh, and optimized asset delivery out of the box.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6 transition hover:border-zinc-700">
              <ShieldCheck className="h-8 w-8 text-violet-400" />
              <h3 className="mt-4 font-semibold text-white">TypeScript</h3>
              <p className="mt-2 text-xs text-zinc-400">
                End-to-end type safety from database models and API routes to frontend React UI components.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6 transition hover:border-zinc-700">
              <Database className="h-8 w-8 text-pink-400" />
              <h3 className="mt-4 font-semibold text-white">Neon PostgreSQL</h3>
              <p className="mt-2 text-xs text-zinc-400">
                Serverless branching Postgres with sub-millisecond query execution and zero connection overhead.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-6 transition hover:border-zinc-700">
              <Layers className="h-8 w-8 text-cyan-400" />
              <h3 className="mt-4 font-semibold text-white">Drizzle ORM</h3>
              <p className="mt-2 text-xs text-zinc-400">
                Lightweight, performant TypeScript ORM with schema migrations, studio UI, and relations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Collections</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Shop by Category</h2>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/80 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-100 group-hover:text-indigo-400 transition">
                    {cat.name}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-indigo-400" />
                </div>
                <p className="mt-2 text-xs text-zinc-500">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section id="products" className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Featured Releases</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Curated Essentials</h2>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {sampleProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-700"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-medium text-zinc-300">
                      {product.badge}
                    </span>
                    <span className="text-xs text-zinc-500">{product.category}</span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-white">{product.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">{product.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">{product.price}</span>
                    {product.comparePrice && (
                      <span className="text-xs text-zinc-500 line-through">{product.comparePrice}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="rounded-lg bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-indigo-600 hover:text-white"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dev Environment & Database Setup Guide */}
      <section id="dev" className="py-20 bg-zinc-900/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Developer Environment Quickstart</h3>
                <p className="text-xs text-zinc-400">Configured scripts and database controls for Novuria</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  1. Credentials Configuration
                </h4>
                <div className="rounded-lg bg-zinc-950 p-4 font-mono text-xs text-zinc-300 border border-zinc-800">
                  <p className="text-zinc-500"># Copy example environment file</p>
                  <p className="text-indigo-300">cp .env.example .env.local</p>
                  <p className="mt-3 text-zinc-500"># Set your Neon connection string in .env.local</p>
                  <p className="text-emerald-400">DATABASE_URL=&quot;postgresql://user:pass@ep-xyz.neon.tech/novuria?sslmode=require&quot;</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  2. Database Migration & Seed Commands
                </h4>
                <div className="rounded-lg bg-zinc-950 p-4 font-mono text-xs text-zinc-300 border border-zinc-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-indigo-300">pnpm db:push</span>
                    <span className="text-zinc-500"># Push schema to Neon</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300">pnpm db:generate</span>
                    <span className="text-zinc-500"># Generate SQL migrations</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300">pnpm db:seed</span>
                    <span className="text-zinc-500"># Populate sample products</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300">pnpm db:studio</span>
                    <span className="text-zinc-500"># Open Drizzle Web Studio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row text-xs text-zinc-500">
          <p>&copy; 2026 Novuria Storefront. Built with Next.js, Neon Postgres, & Drizzle ORM.</p>
          <div className="flex items-center gap-6">
            <Link href="/api/health" className="hover:text-zinc-300">
              API Health
            </Link>
            <a
              href="https://github.com/codesbyashmit/novuria-revamp"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-300"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
