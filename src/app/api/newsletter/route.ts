import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { z } from 'zod';

const subscriberSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = subscriberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    await db
      .insert(schema.newsletterSubscribers)
      .values({ email: parsed.data.email })
      .onConflictDoNothing();

    return NextResponse.json({ success: true, message: 'Welcome to the Novuria Guild' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
