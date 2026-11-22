import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

const adjustStockSchema = z.object({
  variantId: z.string().uuid(),
  quantityChange: z.number().int(),
  reason: z.string().min(1),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  const items = await db
    .select({
      inventoryId: schema.inventory.id,
      variantId: schema.productVariants.id,
      sku: schema.productVariants.sku,
      color: schema.productVariants.color,
      size: schema.productVariants.size,
      pricePaise: schema.productVariants.pricePaise,
      productId: schema.products.id,
      productName: schema.products.name,
      productSlug: schema.products.slug,
      quantityOnHand: schema.inventory.quantityOnHand,
      reservedQuantity: schema.inventory.reservedQuantity,
      reorderThreshold: schema.inventory.reorderThreshold,
      updatedAt: schema.inventory.updatedAt,
    })
    .from(schema.inventory)
    .innerJoin(schema.productVariants, eq(schema.inventory.variantId, schema.productVariants.id))
    .innerJoin(schema.products, eq(schema.productVariants.productId, schema.products.id))
    .orderBy(desc(schema.inventory.updatedAt));

  const logs = await db
    .select()
    .from(schema.inventoryAuditLogs)
    .orderBy(desc(schema.inventoryAuditLogs.createdAt))
    .limit(50);

  return NextResponse.json({ items, logs });
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
    const parsed = adjustStockSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { variantId, quantityChange, reason } = parsed.data;

    const current = await db
      .select()
      .from(schema.inventory)
      .where(eq(schema.inventory.variantId, variantId))
      .limit(1);

    if (current.length === 0) {
      return NextResponse.json({ error: 'Inventory record not found' }, { status: 404 });
    }

    const inv = current[0];
    const newQuantity = inv.quantityOnHand + quantityChange;

    if (newQuantity < 0) {
      return NextResponse.json({ error: 'Quantity on hand cannot be negative' }, { status: 400 });
    }

    const [updated] = await db
      .update(schema.inventory)
      .set({
        quantityOnHand: newQuantity,
        updatedAt: new Date(),
      })
      .where(eq(schema.inventory.id, inv.id))
      .returning();

    await db.insert(schema.inventoryAuditLogs).values({
      variantId,
      changeQuantity: quantityChange,
      balanceAfter: newQuantity,
      reason,
    });

    return NextResponse.json({ success: true, inventory: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to adjust stock', details: String(err) }, { status: 500 });
  }
}
