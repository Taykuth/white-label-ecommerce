import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");

  const where: Record<string, unknown> = { isActive: true };
  if (category) where.categoryId = category;
  if (featured === "true") where.isFeatured = true;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { tags: { contains: search } },
    ];
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 }, category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const body = await req.json();
  const { name, slug, description, price, comparePrice, sku, stock, categoryId, isActive, isFeatured, tags, images } = body;

  if (!name || !slug || !description) {
    return NextResponse.json({ error: "Ad, slug ve aciklama zorunludur." }, { status: 400 });
  }

  const product = await db.product.create({
    data: {
      name, slug, description,
      price: parseFloat(price) || 0,
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      sku: sku || null,
      stock: parseInt(stock) || 0,
      categoryId: categoryId || null,
      isActive: isActive !== false,
      isFeatured: isFeatured === true,
      tags: tags || null,
    },
  });

  if (images && Array.isArray(images)) {
    for (let i = 0; i < images.length; i++) {
      await db.productImage.create({
        data: { url: images[i], alt: name, sortOrder: i, productId: product.id },
      });
    }
  }

  return NextResponse.json(product, { status: 201 });
}
