import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, surname, email, phone, password } = await req.json();

    if (!name || !surname || !email || !password) {
      return NextResponse.json({ error: "Tum alanlar zorunludur." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Sifre en az 6 karakter olmalidir." }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Bu email adresi zaten kayitli." }, { status: 400 });
    }

    const passwordHash = await hash(password, 12);

    await db.user.create({
      data: { name, surname, email, phone: phone || null, passwordHash, role: "CUSTOMER" },
    });

    return NextResponse.json({ message: "Kayit basarili!" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatasi." }, { status: 500 });
  }
}
