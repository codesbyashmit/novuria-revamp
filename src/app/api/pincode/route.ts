import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.trim();

  if (!code || !/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { error: 'Please enter a valid 6-digit Indian postal pincode' },
      { status: 400 }
    );
  }

  const [record] = await db
    .select()
    .from(schema.pincodeServiceability)
    .where(eq(schema.pincodeServiceability.pincode, code))
    .limit(1);

  if (!record || !record.isServiceable) {
    return NextResponse.json({
      serviceable: false,
      pincode: code,
      message: 'Currently outside direct White-Glove delivery network. Standard postal dispatch available upon request.',
    });
  }

  return NextResponse.json({
    serviceable: true,
    pincode: code,
    city: record.city,
    state: record.state,
    estimatedDaysMin: record.estimatedDaysMin,
    estimatedDaysMax: record.estimatedDaysMax,
    isCodAvailable: record.isCodAvailable,
    expressAvailable: record.expressAvailable,
    standardFeePaise: record.standardFeePaise,
    expressFeePaise: record.expressFeePaise,
    estimateText: `Estimated delivery to ${record.city}, ${record.state}: ${record.estimatedDaysMin}-${record.estimatedDaysMax} business days`,
  });
}

