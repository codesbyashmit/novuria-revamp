import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const occasionId = searchParams.get('occasionId');
  const type = searchParams.get('type');

  let conditions = eq(schema.products.isActive, true);

  if (occasionId) {
    conditions = and(conditions, eq(schema.products.occasionId, occasionId))!;
  }

  if (type === 'new_arrivals') {
    conditions = and(conditions, eq(schema.products.isNewArrival, true))!;
  } else if (type === 'bestsellers') {
    conditions = and(conditions, eq(schema.products.isBestseller, true))!;
  }

  const productsList = await db
    .select()
    .from(schema.products)
    .where(conditions)
    .orderBy(desc(schema.products.createdAt));

  return NextResponse.json({ products: productsList });
}
