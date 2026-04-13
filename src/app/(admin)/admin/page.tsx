import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { formatPrice, ORDER_STATUS_MAP } from "@/lib/constants";
import Link from "next/link";

export default async function AdminDashboard() {
  const [productCount, orderCount, customerCount, recentOrders, totalRevenue] =
    await Promise.all([
      db.product.count(),
      db.order.count(),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, surname: true } } },
      }),
      db.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "PAID" },
      }),
    ]);

  const stats = [
    { label: "Toplam Urun", value: productCount, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Toplam Siparis", value: orderCount, icon: ShoppingCart, color: "text-green-600", bg: "bg-green-50" },
    { label: "Musteri Sayisi", value: customerCount, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    {
      label: "Toplam Gelir",
      value: formatPrice(totalRevenue._sum.total || 0),
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Son Siparisler</CardTitle>
            <Link href="/admin/siparisler" className="text-sm text-primary hover:underline">
              Tumunu Gor
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">Henuz siparis bulunmuyor.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const status = ORDER_STATUS_MAP[order.status] || {
                  label: order.status,
                  color: "bg-gray-100 text-gray-800",
                };
                return (
                  <Link
                    key={order.id}
                    href={`/admin/siparisler/${order.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">
                        {order.user.name} {order.user.surname} -{" "}
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={status.color}>{status.label}</Badge>
                      <span className="font-semibold text-sm">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
