import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.warn('Environment validation warnings:', parsed.error.format());
}

export const env = parsed.success
  ? parsed.data
  : {
      DATABASE_URL: process.env.DATABASE_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    };
