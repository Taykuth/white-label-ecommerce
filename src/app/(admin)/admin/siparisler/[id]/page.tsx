import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, ORDER_STATUS_MAP } from "@/lib/constants";
import { OrderStatusUpdate } from "@/components/admin/order-status-update";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      user: { select: { name: true, surname: true, email: true, phone: true } },
    },
  });

  if (!order) notFound();

  const status = ORDER_STATUS_MAP[order.status] || { label: order.status, color: "bg-gray-100 text-gray-800" };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/siparisler">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Siparis #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString("tr-TR", {
              year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <Badge className={`ml-auto ${status.color}`}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card>
            <CardHeader><CardTitle>Urunler</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{item.productName}</p>
                      {item.variantName && <p className="text-xs text-gray-500">{item.variantName}</p>}
                      <p className="text-xs text-gray-400">{item.quantity} x {formatPrice(item.unitPrice)}</p>
                    </div>
                    <p className="font-semibold text-sm">{formatPrice(item.totalPrice)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status update */}
          <Card>
            <CardHeader><CardTitle>Durum Guncelle</CardTitle></CardHeader>
            <CardContent>
              <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader><CardTitle>Ozet</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
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
                <span>{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader><CardTitle>Musteri</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">{order.user.name} {order.user.surname}</p>
              <p className="text-gray-500">{order.user.email}</p>
              {order.user.phone && <p className="text-gray-500">{order.user.phone}</p>}
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader><CardTitle>Teslimat</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">{order.shippingName}</p>
              <p className="text-gray-500">{order.shippingAddress}</p>
              <p className="text-gray-500">{order.shippingCity}</p>
              <p className="text-gray-500">{order.shippingPhone}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
