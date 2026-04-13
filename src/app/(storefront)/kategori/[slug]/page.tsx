import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/product-card";
import { brandConfig } from "../../../../../brand.config";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: brandConfig.seo.titleTemplate.replace("%s", category.name),
    description: category.description || `${category.name} kategorisindeki urunler`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await db.category.findUnique({
    where: { slug, isActive: true },
  });

  if (!category) notFound();

  const products = await db.product.findMany({
    where: { categoryId: category.id, isActive: true },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-gray-500 mt-2">{category.description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          Bu kategoride henuz urun bulunmuyor.
        </p>
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
