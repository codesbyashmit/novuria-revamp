import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import fs from 'node:fs';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';

async function runCleanMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured in .env.local');
  }

  const sql = neon(connectionString);

  await sql`DROP SCHEMA IF EXISTS public CASCADE;`;
  await sql`CREATE SCHEMA public;`;
  await sql`GRANT ALL ON SCHEMA public TO public;`;
  await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;`;

  const migrationFilePath = path.join(process.cwd(), 'drizzle', '0000_chemical_nightcrawler.sql');
  const migrationSql = fs.readFileSync(migrationFilePath, 'utf-8');

  const statements = migrationSql
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await sql.query(statement);
  }

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      email varchar(255) NOT NULL UNIQUE,
      created_at timestamp with time zone DEFAULT now() NOT NULL
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin (name gin_trgm_ops);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_products_desc_trgm ON products USING gin (description gin_trgm_ops);
  `;

  console.log('Database migrated cleanly with all 44 tables, newsletter_subscribers and pg_trgm indexes.');
}

runCleanMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
