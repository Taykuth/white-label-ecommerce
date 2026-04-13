import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatPrice, ORDER_STATUS_MAP } from "@/lib/constants";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/giris");

  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id, userId: session.user.id },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
        },
      },
    },
  });

  if (!order) notFound();

  const status = ORDER_STATUS_MAP[order.status] || {
    label: order.status,
    color: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Siparis #{order.orderNumber}</h1>
        <Badge className={status.color}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold mb-3">Urunler</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-50 shrink-0">
                {item.product.images?.[0] && (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.productName}</p>
                {item.variantName && (
                  <p className="text-xs text-gray-500">{item.variantName}</p>
                )}
                <p className="text-xs text-gray-500">{item.quantity} adet</p>
              </div>
              <p className="font-semibold text-sm">{formatPrice(item.totalPrice)}</p>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="font-semibold mb-4">Siparis Ozeti</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ara Toplam</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kargo</span>
                <span>{order.shippingCost === 0 ? "Ucretsiz" : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Toplam</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 rounded-lg p-6">
            <h2 className="font-semibold mb-3">Teslimat Adresi</h2>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}</p>
              <p>{order.shippingPhone}</p>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            Siparis Tarihi: {new Date(order.createdAt).toLocaleDateString("tr-TR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
