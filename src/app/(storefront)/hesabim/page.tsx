import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MapPin, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/giris");

  const [orderCount, addressCount] = await Promise.all([
    db.order.count({ where: { userId: session.user.id } }),
    db.address.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hos Geldiniz, {session.user.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/hesabim/siparisler">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Package className="text-primary" size={24} />
              <CardTitle className="text-base">Siparislerim</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{orderCount}</p>
              <p className="text-sm text-gray-500">toplam siparis</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/hesabim/adresler">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <MapPin className="text-primary" size={24} />
              <CardTitle className="text-base">Adreslerim</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{addressCount}</p>
              <p className="text-sm text-gray-500">kayitli adres</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/sepet">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <ShoppingCart className="text-primary" size={24} />
              <CardTitle className="text-base">Sepetim</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Alisverise devam edin</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="font-semibold mb-4">Hesap Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Ad Soyad:</span>
            <p className="font-medium">{session.user.name}</p>
          </div>
          <div>
            <span className="text-gray-500">Email:</span>
            <p className="font-medium">{session.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
