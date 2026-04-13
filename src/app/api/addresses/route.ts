import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json([], { status: 401 });

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const body = await req.json();
  const { title, name, surname, phone, address, city, district, zipCode } = body;

  if (!title || !name || !surname || !phone || !address || !city || !district) {
    return NextResponse.json({ error: "Tum alanlar zorunludur." }, { status: 400 });
  }

  const newAddress = await db.address.create({
    data: {
      userId: session.user.id,
      title, name, surname, phone, address, city, district,
      zipCode: zipCode || null,
    },
  });

  return NextResponse.json(newAddress, { status: 201 });
}
