import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const isAdmin = session.user.role === "ADMIN";

  const orders = await db.order.findMany({
    where: isAdmin ? {} : { userId: session.user.id },
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, surname: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
