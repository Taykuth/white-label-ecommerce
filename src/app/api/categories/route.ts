import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const categories = await db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const body = await req.json();
  const { name, slug, description, image, parentId, sortOrder } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Ad ve slug zorunludur." }, { status: 400 });
  }

  const category = await db.category.create({
    data: {
      name, slug,
      description: description || null,
      image: image || null,
      parentId: parentId || null,
      sortOrder: parseInt(sortOrder) || 0,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
