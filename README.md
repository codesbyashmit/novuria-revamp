# Novuria E-Commerce

A modern, high-performance e-commerce web platform built with **TypeScript**, **Next.js (App Router)**, **Neon Serverless PostgreSQL**, and **Drizzle ORM**.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type safety across DB and UI)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Neon PostgreSQL](https://neon.tech/) (Serverless Postgres with instant branching)
- **ORM & Migrations**: [Drizzle ORM](https://orm.drizzle.team/) & [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 🔑 Required Credentials

To run the application with database access, you will need a **Neon PostgreSQL connection string**.

### 1. Neon Database URL
- Sign up or log into [Neon Console](https://console.neon.tech).
- Create a new project (e.g. `novuria`).
- Copy the PostgreSQL connection string. It will look like:
  ```text
  postgresql://[user]:[password]@[endpoint-pooler].[region].aws.neon.tech/[dbname]?sslmode=require
  ```
  *(Note: Neon provides both pooled and direct connection strings. The pooled connection string is recommended for Next.js serverless environments).*

### 2. Environment File Setup
Create a `.env.local` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env.local
```

Populate the values in `.env.local`:
```env
DATABASE_URL="postgresql://user:password@ep-xyz.region.aws.neon.tech/novuria?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Database Commands
```bash
# Generate SQL migration files from Drizzle schema
pnpm db:generate

# Push schema directly to Neon database
pnpm db:push

# Run migrations against Neon
pnpm db:migrate

# Seed the database with sample categories and products
pnpm db:seed

# Launch interactive Drizzle Studio in browser
pnpm db:studio
```

### 3. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.  
Visit [http://localhost:3000/api/health](http://localhost:3000/api/health) to verify your database connectivity.

---

## 🗄️ Database Schema Overview

The initial schema includes 7 tables located in `src/db/schema/`:

- **`users`**: Customer accounts, authentication hashes, and admin roles.
- **`categories`**: Product classifications and slugs.
- **`products`**: Product catalog, prices, compare prices, stock levels, SKUs, and image arrays.
- **`carts`**: Active carts for registered and guest users.
- **`cart_items`**: Items added to carts with quantities and product references.
- **`orders`**: Checkout orders, fulfillment status, and payment identifiers.
- **`order_items`**: Line items snapshot with historical price at purchase.
- **`relations`**: Drizzle relational graph enabling seamless nested joins.

---

## 📁 Project Structure

```text
novuria/
├── drizzle/              # Generated SQL migration files and metadata
├── public/               # Static public assets and vectors
├── src/
│   ├── app/              # Next.js App Router (pages, layouts, API routes)
│   │   ├── api/
│   │   │   └── health/   # Neon DB health check endpoint
│   │   ├── globals.css   # Tailwind global styles
│   │   ├── layout.tsx    # Root layout & metadata
│   │   └── page.tsx      # E-commerce landing page & catalog showcase
│   ├── db/
│   │   ├── schema/       # Drizzle table schemas & relation definitions
│   │   ├── index.ts      # Neon connection client & Drizzle instance
│   │   └── seed.ts       # Database seeder script
│   └── lib/
│       └── env.ts        # Type-safe environment validation
├── .env.example          # Environment variable template
├── drizzle.config.ts     # Drizzle Kit configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
├── pnpm-lock.yaml        # Lockfile
└── tsconfig.json         # TypeScript configuration
```
