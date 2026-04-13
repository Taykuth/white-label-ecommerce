import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  const address = await db.address.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!address) return NextResponse.json({ error: "Adres bulunamadi." }, { status: 404 });

  await db.address.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
