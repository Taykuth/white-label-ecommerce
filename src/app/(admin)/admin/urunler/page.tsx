import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { images: { take: 1 }, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Urunler ({products.length})</h1>
        <Link href="/admin/urunler/yeni">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Urun
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Urun</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Kategori</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Fiyat</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Stok</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase p-4">Durum</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase p-4">Islemler</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{product.category?.name || "-"}</td>
                <td className="p-4">
                  <div>
                    <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                    {product.comparePrice && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(product.comparePrice)}
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-sm font-medium ${product.stock <= 5 ? "text-red-600" : "text-gray-700"}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4">
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Aktif" : "Pasif"}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/urunler/${product.id}`}>
                      <Button variant="outline" size="sm">Duzenle</Button>
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
