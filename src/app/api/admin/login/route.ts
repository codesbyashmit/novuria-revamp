import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { createSession } from '@/lib/auth';
import { eq, or } from 'drizzle-orm';
import { z } from 'zod';

const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().optional(),
});

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { identifier } = parsed.data;

    const result = await db
      .select()
      .from(schema.users)
      .where(or(eq(schema.users.email, identifier), eq(schema.users.phone, identifier)))
      .limit(1);

    const user = result[0];
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized credentials' }, { status: 401 });
    }

    const token = await createSession(
      user.id,
      request.headers.get('user-agent') || undefined,
      request.headers.get('x-forwarded-for') || undefined
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

    response.cookies.set('novuria_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

