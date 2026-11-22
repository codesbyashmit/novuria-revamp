import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import { desc } from 'drizzle-orm';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  collectionId: z.string().uuid().optional().nullable(),
  occasionId: z.string().uuid().optional().nullable(),
  fabricId: z.string().uuid().optional().nullable(),
  basePricePaise: z.number().int().positive(),
  compareAtPricePaise: z.number().int().positive().optional().nullable(),
  sku: z.string().optional().nullable(),
  badges: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        sku: z.string().min(1),
        color: z.string().min(1),
        colorHex: z.string().optional(),
        size: z.string().min(1),
        pricePaise: z.number().int().positive(),
        compareAtPricePaise: z.number().int().positive().optional().nullable(),
        initialStock: z.number().int().min(0).default(0),
      })
    )
    .optional(),
  images: z
    .array(
      z.object({
        imageUrl: z.string().url(),
        altText: z.string().min(1),
        color: z.string().optional(),
        isPrimary: z.boolean().optional(),
        displayOrder: z.number().int().default(0),
      })
    )
    .optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
  }

  const productsList = await db
    .select()
    .from(schema.products)
    .orderBy(desc(schema.products.createdAt));

  const variantsList = await db.select().from(schema.productVariants);
  const imagesList = await db.select().from(schema.productImages);

  const productsWithDetails = productsList.map((p) => ({
    ...p,
    variants: variantsList.filter((v) => v.productId === p.id),
    images: imagesList.filter((img) => img.productId === p.id),
  }));

  return NextResponse.json({ products: productsWithDetails });
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
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;

    const [product] = await db
      .insert(schema.products)
      .values({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        categoryId: data.categoryId || null,
        collectionId: data.collectionId || null,
        occasionId: data.occasionId || null,
        fabricId: data.fabricId || null,
        basePricePaise: data.basePricePaise,
        compareAtPricePaise: data.compareAtPricePaise || null,
        sku: data.sku || null,
        badges: data.badges || [],
        isFeatured: data.isFeatured ?? false,
        isNewArrival: data.isNewArrival ?? false,
        isBestseller: data.isBestseller ?? false,
        isActive: true,
      })
      .returning();

    if (data.variants && data.variants.length > 0) {
      for (const variant of data.variants) {
        const [insertedVariant] = await db
          .insert(schema.productVariants)
          .values({
            productId: product.id,
            sku: variant.sku,
            color: variant.color,
            colorHex: variant.colorHex || null,
            size: variant.size,
            pricePaise: variant.pricePaise,
            compareAtPricePaise: variant.compareAtPricePaise || null,
            isActive: true,
          })
          .returning();

        await db.insert(schema.inventory).values({
          variantId: insertedVariant.id,
          quantityOnHand: variant.initialStock,
          reservedQuantity: 0,
        });

        await db.insert(schema.inventoryAuditLogs).values({
          variantId: insertedVariant.id,
          changeQuantity: variant.initialStock,
          balanceAfter: variant.initialStock,
          reason: 'initial_stock_creation',
        });
      }
    }

    if (data.images && data.images.length > 0) {
      for (const img of data.images) {
        await db.insert(schema.productImages).values({
          productId: product.id,
          imageUrl: img.imageUrl,
          altText: img.altText,
          color: img.color || null,
          isPrimary: img.isPrimary ?? false,
          displayOrder: img.displayOrder,
        });
      }
    }

    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create product', details: String(err) }, { status: 500 });
  }
}
