import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { formatPrice, ORDER_STATUS_MAP } from "@/lib/constants";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, surname: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Siparisler ({orders.length})</h1>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Siparis No</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Musteri</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Tarih</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Durum</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Odeme</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase p-4">Toplam</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => {
              const status = ORDER_STATUS_MAP[order.status] || { label: order.status, color: "bg-gray-100 text-gray-800" };
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <Link href={`/admin/siparisler/${order.id}`} className="text-sm font-medium text-primary hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{order.user.name} {order.user.surname}</p>
                    <p className="text-xs text-gray-400">{order.user.email}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="p-4">
                    <Badge className={status.color}>{status.label}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"}>
                      {order.paymentStatus === "PAID" ? "Odendi" : "Beklemede"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right font-medium text-sm">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center text-gray-500 py-8">Henuz siparis bulunmuyor.</p>
        )}
      </div>
    </div>
  );
}
