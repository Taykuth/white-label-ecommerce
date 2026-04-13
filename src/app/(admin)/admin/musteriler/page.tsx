import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export default async function AdminCustomersPage() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: { select: { orders: true } },
      orders: { select: { total: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Musteriler ({customers.length})</h1>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Musteri</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Email</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Telefon</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Siparis</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Kayit Tarihi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.map((customer) => {
              const totalSpent = customer.orders.reduce((sum, o) => sum + o.total, 0);
              return (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="text-sm font-medium">{customer.name} {customer.surname}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{customer.email}</td>
                  <td className="p-4 text-sm text-gray-600">{customer.phone || "-"}</td>
                  <td className="p-4">
                    <Badge variant="secondary">{customer._count.orders} siparis</Badge>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p className="text-center text-gray-500 py-8">Henuz musteri bulunmuyor.</p>
        )}
      </div>
    </div>
  );
}
