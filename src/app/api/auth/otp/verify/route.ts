import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import crypto from 'crypto';
import { and, desc, eq, gt } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { z } from 'zod';

const verifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  code: z.string().length(6),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = verifyOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Valid phone and 6-digit code required' }, { status: 400 });
    }

    let phone = parsed.data.phone.trim();
    if (!phone.startsWith('+')) {
      if (phone.length === 10) {
        phone = `+91${phone}`;
      } else {
        phone = `+${phone}`;
      }
    }

    const { code, name } = parsed.data;
    const providedHash = crypto.createHash('sha256').update(code).digest('hex');

    const [challenge] = await db
      .select()
      .from(schema.otpChallenges)
      .where(
        and(
          eq(schema.otpChallenges.phone, phone),
          eq(schema.otpChallenges.isUsed, false),
          gt(schema.otpChallenges.expiresAt, new Date())
        )
      )
      .orderBy(desc(schema.otpChallenges.createdAt))
      .limit(1);

    if (!challenge) {
      return NextResponse.json({ error: 'Access code expired or not requested' }, { status: 400 });
    }

    if (challenge.otpHash !== providedHash) {
      await db
        .update(schema.otpChallenges)
        .set({ attemptsCount: challenge.attemptsCount + 1 })
        .where(eq(schema.otpChallenges.id, challenge.id));

      return NextResponse.json({ error: 'Invalid access code' }, { status: 400 });
    }

    await db
      .update(schema.otpChallenges)
      .set({ isUsed: true })
      .where(eq(schema.otpChallenges.id, challenge.id));

    let [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.phone, phone))
      .limit(1);

    if (!user) {
      const [newUser] = await db
        .insert(schema.users)
        .values({
          phone,
          name: name || 'Atelier Patron',
          role: 'customer',
          isPhoneVerified: true,
        })
        .returning();
      user = newUser;
    } else if (name && user.name === 'Atelier Patron') {
      const [updated] = await db
        .update(schema.users)
        .set({ name })
        .where(eq(schema.users.id, user.id))
        .returning();
      user = updated;
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Atelier Client';

    await db.insert(schema.sessions).values({
      userId: user.id,
      sessionToken,
      ipAddress,
      userAgent,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set('novuria_session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Authentication failed', details: String(err) }, { status: 500 });
  }
}
