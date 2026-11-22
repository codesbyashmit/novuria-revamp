import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

const updateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum([
    'placed',
    'confirmed',
    'packed',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'returned',
  ]),
  notes: z.string().optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  const ordersList = await db
    .select()
    .from(schema.orders)
    .orderBy(desc(schema.orders.createdAt));

  const itemsList = await db.select().from(schema.orderItems);
  const historyList = await db.select().from(schema.orderStatusHistory);

  const fullOrders = ordersList.map((order) => ({
    ...order,
    items: itemsList.filter((item) => item.orderId === order.id),
    history: historyList.filter((h) => h.orderId === order.id),
  }));

  return NextResponse.json({ orders: fullOrders });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { orderId, status, notes } = parsed.data;

    const [updatedOrder] = await db
      .update(schema.orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, orderId))
      .returning();

    await db.insert(schema.orderStatusHistory).values({
      orderId,
      toStatus: status,
      comment: notes || `Status updated to ${status} by admin`,
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update order status', details: String(err) }, { status: 500 });
  }
}
