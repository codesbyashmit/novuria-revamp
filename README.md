# Novuria E-Commerce

A modern, high-performance e-commerce web platform built with TypeScript, Next.js (App Router), Neon Serverless PostgreSQL, and Drizzle ORM.

---

## Tech Stack

- Framework: Next.js (App Router, React 19, Server Components)
- Language: TypeScript (Strict type safety across DB and UI)
- Styling: Tailwind CSS
- Database: Neon PostgreSQL (Serverless Postgres with instant branching)
- ORM & Migrations: Drizzle ORM & Drizzle Kit
- Validation: Zod
- Package Manager: pnpm

---

## Required Credentials

To run the application with database access, you will need a Neon PostgreSQL connection string.

### 1. Neon Database URL
- Sign up or log into Neon Console (https://console.neon.tech).
- Create a new project (for example, novuria).
- Copy the PostgreSQL connection string:
  ```text
  postgresql://[user]:[password]@[endpoint-pooler].[region].aws.neon.tech/[dbname]?sslmode=require
  ```

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

## Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Database Commands
```bash
pnpm db:generate
pnpm db:push
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

### 3. Run Development Server
```bash
pnpm dev
```

Open http://localhost:3000 to view the storefront.
Visit http://localhost:3000/api/health to verify your database connectivity.

---

## Database Schema Overview

The initial schema includes 7 tables located in `src/db/schema/`:

- users: Customer accounts, authentication hashes, and admin roles.
- categories: Product classifications and slugs.
- products: Product catalog, prices, compare prices, stock levels, SKUs, and image arrays.
- carts: Active carts for registered and guest users.
- cart_items: Items added to carts with quantities and product references.
- orders: Checkout orders, fulfillment status, and payment identifiers.
- order_items: Line items snapshot with historical price at purchase.
- relations: Drizzle relational graph enabling seamless nested joins.

---

## Project Structure

```text
novuria/
├── drizzle/              
├── public/               
├── src/
│   ├── app/              
│   │   ├── api/
│   │   │   └── health/   
│   │   ├── globals.css   
│   │   ├── layout.tsx    
│   │   └── page.tsx      
│   ├── db/
│   │   ├── schema/       
│   │   ├── index.ts      
│   │   └── seed.ts       
│   └── lib/
│       └── env.ts        
├── .env.example          
├── drizzle.config.ts     
├── next.config.ts        
├── package.json          
├── pnpm-lock.yaml        
└── tsconfig.json         
```
