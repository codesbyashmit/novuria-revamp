import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

export const client = connectionString ? neon(connectionString) : null;
export const db = client ? drizzle(client, { schema }) : null;

export function getDb() {
  if (!db) {
    throw new Error(
      'DATABASE_URL is not configured. Please set your Neon PostgreSQL connection string in .env.local.'
    );
  }
  return db;
}
