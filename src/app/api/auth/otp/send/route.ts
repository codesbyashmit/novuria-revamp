import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import crypto from 'crypto';
import { z } from 'zod';

const sendOtpSchema = z.object({
  phone: z.string().min(10).max(15),
});

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = sendOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Valid phone number required' }, { status: 400 });
    }

    let phone = parsed.data.phone.trim();
    if (!phone.startsWith('+')) {
      if (phone.length === 10) {
        phone = `+91${phone}`;
      } else {
        phone = `+${phone}`;
      }
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash('sha256').update(otpCode).digest('hex');

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.insert(schema.otpChallenges).values({
      phone,
      otpHash,
      purpose: 'login',
      expiresAt,
    });

    return NextResponse.json({
      success: true,
      phone,
      message: 'Atelier access code dispatched',
      testOtp: process.env.NODE_ENV === 'development' ? otpCode : undefined,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to dispatch access code', details: String(err) }, { status: 500 });
  }
}

