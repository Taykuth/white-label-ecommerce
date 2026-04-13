import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";
import Link from "next/link";
import { brandConfig } from "../../../../brand.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Tum Urunler ${brandConfig.seo.titleTemplate.replace("%s", "")}`,
};

interface Props {
  searchParams: Promise<{ kategori?: string; siralama?: string; sayfa?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.sayfa || "1");
  const perPage = 12;

  const where: Record<string, unknown> = { isActive: true };
  if (params.kategori) {
    const category = await db.category.findUnique({
      where: { slug: params.kategori },
    });
    if (category) where.categoryId = category.id;
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (params.siralama === "fiyat-artan") orderBy = { price: "asc" };
  if (params.siralama === "fiyat-azalan") orderBy = { price: "desc" };
  if (params.siralama === "yeni") orderBy = { createdAt: "desc" };

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.product.count({ where }),
    db.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 shrink-0">
          <h2 className="font-semibold mb-4">Kategoriler</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/urunler"
                className={`text-sm hover:text-primary transition-colors ${
                  !params.kategori ? "text-primary font-medium" : "text-gray-600"
                }`}
              >
                Tum Urunler ({total})
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/urunler?kategori=${cat.slug}`}
                  className={`text-sm hover:text-primary transition-colors ${
                    params.kategori === cat.slug
                      ? "text-primary font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h2 className="font-semibold mb-4">Siralama</h2>
            <ul className="space-y-2">
              {[
                { value: "", label: "Varsayilan" },
                { value: "fiyat-artan", label: "Fiyat: Dusukten Yuksege" },
                { value: "fiyat-azalan", label: "Fiyat: Yuksekten Dusuge" },
                { value: "yeni", label: "En Yeni" },
              ].map((opt) => (
                <li key={opt.value}>
                  <Link
                    href={`/urunler?${params.kategori ? `kategori=${params.kategori}&` : ""}${opt.value ? `siralama=${opt.value}` : ""}`}
                    className={`text-sm hover:text-primary transition-colors ${
                      (params.siralama || "") === opt.value
                        ? "text-primary font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {params.kategori
                ? categories.find((c) => c.slug === params.kategori)?.name || "Urunler"
                : "Tum Urunler"}
            </h1>
            <span className="text-sm text-gray-500">{total} urun</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">Bu kategoride henuz urun bulunmuyor.</p>
              <Link href="/urunler" className="text-primary hover:underline">
                Tum urunlere goz at
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  comparePrice={product.comparePrice}
                  image={product.images[0]?.url || "/placeholder.jpg"}
                  stock={product.stock}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/urunler?${params.kategori ? `kategori=${params.kategori}&` : ""}${params.siralama ? `siralama=${params.siralama}&` : ""}sayfa=${p}`}
                  className={`px-3 py-1 rounded text-sm ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
