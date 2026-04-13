import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatPrice, ORDER_STATUS_MAP } from "@/lib/constants";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/giris");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Siparislerim</h1>
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Henuz siparisiz bulunmuyor.</p>
          <Link href="/urunler" className="text-primary hover:underline">
            Alisverise Basla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Siparislerim</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const status = ORDER_STATUS_MAP[order.status] || {
            label: order.status,
            color: "bg-gray-100 text-gray-800",
          };
          return (
            <Link
              key={order.id}
              href={`/hesabim/siparisler/${order.id}`}
              className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-medium">{order.orderNumber}</span>
                  <span className="text-sm text-gray-500 ml-3">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <Badge className={status.color}>{status.label}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {order.items.length} urun
                </span>
                <span className="font-bold text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
