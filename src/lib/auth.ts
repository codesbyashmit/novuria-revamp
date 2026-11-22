import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { and, eq, gt } from 'drizzle-orm';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, key] = parts;
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

export async function createSession(userId: string, userAgent?: string, ipAddress?: string): Promise<string> {
  if (!db) throw new Error('Database not initialized');
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.insert(schema.sessions).values({
    userId,
    sessionToken: token,
    userAgent: userAgent || null,
    ipAddress: ipAddress || null,
    expiresAt,
  });

  return token;
}

export async function getCurrentUser() {
  if (!db) return null;
  const cookieStore = await cookies();
  const token = cookieStore.get('novuria_session_token')?.value;
  if (!token) return null;

  const now = new Date();
  const result = await db
    .select({
      user: schema.users,
      session: schema.sessions,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
    .where(and(eq(schema.sessions.sessionToken, token), gt(schema.sessions.expiresAt, now)))
    .limit(1);

  if (!result.length) return null;
  return result[0].user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return null;
  }
  return user;
}

