import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q || "";

  const products = query
    ? await db.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { tags: { contains: query } },
          ],
        },
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        take: 24,
      })
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Arama Sonuclari</h1>
      <p className="text-gray-500 mb-8">
        &quot;{query}&quot; icin {products.length} sonuc bulundu
      </p>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-2">Aramanizla eslesen urun bulunamadi.</p>
          <p className="text-sm text-gray-400">
            Farkli anahtar kelimeler deneyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
