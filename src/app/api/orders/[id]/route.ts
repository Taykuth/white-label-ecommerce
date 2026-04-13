import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const isAdmin = session.user.role === "ADMIN";

  const order = await db.order.findUnique({
    where: isAdmin ? { id } : { id, userId: session.user.id },
    include: {
      items: { include: { product: { include: { images: { take: 1 } } } } },
      user: { select: { id: true, name: true, surname: true, email: true } },
    },
  });

  if (!order) return NextResponse.json({ error: "Siparis bulunamadi." }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const order = await db.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(order);
}
