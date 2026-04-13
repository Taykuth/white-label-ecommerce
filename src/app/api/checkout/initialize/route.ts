import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/constants";
import { brandConfig } from "../../../../../brand.config";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Giris yapmaniz gerekiyor." }, { status: 401 });

  try {
    const body = await req.json();
    const { items, shippingName, shippingAddress, shippingCity, shippingPhone,
            billingName, billingAddress, billingCity, billingPhone, billingTaxId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Sepet bos." }, { status: 400 });
    }

    if (!shippingName || !shippingAddress || !shippingCity || !shippingPhone) {
      return NextResponse.json({ error: "Adres bilgileri eksik." }, { status: 400 });
    }

    // Verify prices from DB (never trust client)
    let subtotal = 0;
    const orderItems: Array<{
      productId: string;
      variantId: string | null;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      productName: string;
      variantName: string | null;
    }> = [];

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId, isActive: true },
        include: { variants: true },
      });

      if (!product) {
        return NextResponse.json({ error: `Urun bulunamadi: ${item.productId}` }, { status: 400 });
      }

      let price = product.price;
      let variantName: string | null = null;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          return NextResponse.json({ error: `Varyant bulunamadi.` }, { status: 400 });
        }
        if (variant.stock < item.quantity) {
          return NextResponse.json({ error: `${product.name} - ${variant.name} stokta yeterli degil.` }, { status: 400 });
        }
        if (variant.price) price = variant.price;
        variantName = variant.name;
      } else {
        if (product.stock < item.quantity) {
          return NextResponse.json({ error: `${product.name} stokta yeterli degil.` }, { status: 400 });
        }
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: itemTotal,
        productName: product.name,
        variantName,
      });
    }

    const shippingCost = subtotal >= brandConfig.shipping.freeShippingThreshold
      ? 0
      : brandConfig.shipping.defaultShippingCost;
    const total = subtotal + shippingCost;

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        status: "CONFIRMED",
        paymentStatus: "PAID", // Demo mode - mark as paid
        subtotal,
        shippingCost,
        total,
        shippingName,
        shippingAddress,
        shippingCity,
        shippingPhone,
        shippingZip: null,
        billingName: billingName || shippingName,
        billingAddress: billingAddress || shippingAddress,
        billingCity: billingCity || shippingCity,
        billingPhone: billingPhone || shippingPhone,
        billingTaxId: billingTaxId || null,
        items: {
          create: orderItems,
        },
      },
    });

    // Decrement stock
    for (const item of items) {
      if (item.variantId) {
        await db.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        await db.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Siparis olusturulurken bir hata olustu." }, { status: 500 });
  }
}
