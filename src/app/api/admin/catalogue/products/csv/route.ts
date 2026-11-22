import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { generateCsv, parseCsv } from '@/lib/csv';
import { eq } from 'drizzle-orm';

interface ProductCsvRow {
  [key: string]: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  color: string;
  colorHex: string;
  size: string;
  priceInRupees: string;
  compareAtInRupees: string;
  stock: string;
  imageUrl: string;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  const productsList = await db.select().from(schema.products);
  const variantsList = await db.select().from(schema.productVariants);
  const inventoryList = await db.select().from(schema.inventory);
  const imagesList = await db.select().from(schema.productImages);

  const inventoryMap = new Map(inventoryList.map((inv) => [inv.variantId, inv.quantityOnHand]));
  const primaryImageMap = new Map(imagesList.filter((img) => img.isPrimary).map((img) => [img.productId, img.imageUrl]));

  const rows: Record<string, unknown>[] = [];

  for (const product of productsList) {
    const productVariants = variantsList.filter((v) => v.productId === product.id);
    const primaryImg = primaryImageMap.get(product.id) || '';

    if (productVariants.length === 0) {
      rows.push({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        sku: product.sku || '',
        color: '',
        colorHex: '',
        size: '',
        priceInRupees: Math.round(product.basePricePaise / 100),
        compareAtInRupees: product.compareAtPricePaise ? Math.round(product.compareAtPricePaise / 100) : '',
        stock: 0,
        imageUrl: primaryImg,
      });
    } else {
      for (const variant of productVariants) {
        rows.push({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          sku: variant.sku,
          color: variant.color,
          colorHex: variant.colorHex || '',
          size: variant.size,
          priceInRupees: Math.round(variant.pricePaise / 100),
          compareAtInRupees: variant.compareAtPricePaise ? Math.round(variant.compareAtPricePaise / 100) : '',
          stock: inventoryMap.get(variant.id) || 0,
          imageUrl: primaryImg,
        });
      }
    }
  }

  const csvContent = generateCsv(rows, [
    { key: 'name', label: 'name' },
    { key: 'slug', label: 'slug' },
    { key: 'description', label: 'description' },
    { key: 'sku', label: 'sku' },
    { key: 'color', label: 'color' },
    { key: 'colorHex', label: 'colorHex' },
    { key: 'size', label: 'size' },
    { key: 'priceInRupees', label: 'priceInRupees' },
    { key: 'compareAtInRupees', label: 'compareAtInRupees' },
    { key: 'stock', label: 'stock' },
    { key: 'imageUrl', label: 'imageUrl' },
  ]);

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="novuria_catalogue_export.csv"',
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
    const rows = parseCsv<ProductCsvRow>(csvText);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty or missing headers' }, { status: 400 });
    }

    let importedCount = 0;

    for (const row of rows) {
      if (!row.name || !row.slug) continue;

      const pricePaise = Math.round(parseFloat(row.priceInRupees || '0') * 100);
      const compareAtPaise = row.compareAtInRupees ? Math.round(parseFloat(row.compareAtInRupees) * 100) : null;
      const stock = parseInt(row.stock || '0', 10);

      const [product] = await db
        .insert(schema.products)
        .values({
          name: row.name,
          slug: row.slug,
          description: row.description || null,
          basePricePaise: pricePaise || 100000,
          compareAtPricePaise: compareAtPaise,
          isActive: true,
        })
        .onConflictDoUpdate({
          target: schema.products.slug,
          set: {
            name: row.name,
            description: row.description || null,
            basePricePaise: pricePaise || 100000,
            compareAtPricePaise: compareAtPaise,
          },
        })
        .returning();

      if (row.sku && row.color && row.size) {
        const [variant] = await db
          .insert(schema.productVariants)
          .values({
            productId: product.id,
            sku: row.sku,
            color: row.color,
            colorHex: row.colorHex || null,
            size: row.size,
            pricePaise: pricePaise || 100000,
            compareAtPricePaise: compareAtPaise,
            isActive: true,
          })
          .onConflictDoUpdate({
            target: schema.productVariants.sku,
            set: {
              pricePaise: pricePaise || 100000,
              compareAtPricePaise: compareAtPaise,
              color: row.color,
              colorHex: row.colorHex || null,
              size: row.size,
            },
          })
          .returning();

        const existingInv = await db
          .select()
          .from(schema.inventory)
          .where(eq(schema.inventory.variantId, variant.id))
          .limit(1);

        if (existingInv.length > 0) {
          await db
            .update(schema.inventory)
            .set({ quantityOnHand: stock })
            .where(eq(schema.inventory.variantId, variant.id));
        } else {
          await db.insert(schema.inventory).values({
            variantId: variant.id,
            quantityOnHand: stock,
            reservedQuantity: 0,
          });
        }
      }

      if (row.imageUrl) {
        await db
          .insert(schema.productImages)
          .values({
            productId: product.id,
            imageUrl: row.imageUrl,
            altText: row.name,
            isPrimary: true,
            displayOrder: 0,
          });
      }

      importedCount++;
    }

    return NextResponse.json({ success: true, count: importedCount });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to import CSV', details: String(err) }, { status: 500 });
  }
}

