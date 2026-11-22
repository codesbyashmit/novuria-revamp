import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { generateCsv, parseCsv } from '@/lib/csv';
import { eq } from 'drizzle-orm';

interface InventoryCsvRow {
  [key: string]: string;
  sku: string;
  productName: string;
  color: string;
  size: string;
  quantityOnHand: string;
  reservedQuantity: string;
}

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
      sku: schema.productVariants.sku,
      productName: schema.products.name,
      color: schema.productVariants.color,
      size: schema.productVariants.size,
      quantityOnHand: schema.inventory.quantityOnHand,
      reservedQuantity: schema.inventory.reservedQuantity,
    })
    .from(schema.inventory)
    .innerJoin(schema.productVariants, eq(schema.inventory.variantId, schema.productVariants.id))
    .innerJoin(schema.products, eq(schema.productVariants.productId, schema.products.id));

  const csvContent = generateCsv(items, [
    { key: 'sku', label: 'sku' },
    { key: 'productName', label: 'productName' },
    { key: 'color', label: 'color' },
    { key: 'size', label: 'size' },
    { key: 'quantityOnHand', label: 'quantityOnHand' },
    { key: 'reservedQuantity', label: 'reservedQuantity' },
  ]);

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="novuria_inventory_export.csv"',
    },
  });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  try {
    const csvText = await request.text();
    const rows = parseCsv<InventoryCsvRow>(csvText);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty or missing headers' }, { status: 400 });
    }

    let updatedCount = 0;

    for (const row of rows) {
      if (!row.sku) continue;
      const targetStock = parseInt(row.quantityOnHand, 10);
      if (isNaN(targetStock) || targetStock < 0) continue;

      const variant = await db
        .select()
        .from(schema.productVariants)
        .where(eq(schema.productVariants.sku, row.sku))
        .limit(1);

      if (variant.length === 0) continue;

      const currentInv = await db
        .select()
        .from(schema.inventory)
        .where(eq(schema.inventory.variantId, variant[0].id))
        .limit(1);

      if (currentInv.length > 0) {
        const diff = targetStock - currentInv[0].quantityOnHand;
        await db
          .update(schema.inventory)
          .set({ quantityOnHand: targetStock, updatedAt: new Date() })
          .where(eq(schema.inventory.id, currentInv[0].id));

        await db.insert(schema.inventoryAuditLogs).values({
          variantId: variant[0].id,
          changeQuantity: diff,
          balanceAfter: targetStock,
          reason: 'bulk_csv_import',
        });
      } else {
        await db.insert(schema.inventory).values({
          variantId: variant[0].id,
          quantityOnHand: targetStock,
          reservedQuantity: 0,
        });

        await db.insert(schema.inventoryAuditLogs).values({
          variantId: variant[0].id,
          changeQuantity: targetStock,
          balanceAfter: targetStock,
          reason: 'bulk_csv_import_initial',
        });
      }

      updatedCount++;
    }

    return NextResponse.json({ success: true, count: updatedCount });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to import inventory CSV', details: String(err) }, { status: 500 });
  }
}
