import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/storefront/product-detail";
import { ProductCard } from "@/components/storefront/product-card";
import { brandConfig } from "../../../../../brand.config";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: brandConfig.seo.titleTemplate.replace("%s", product.name),
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: true,
    },
  });

  if (!product) notFound();

  const relatedProducts = await db.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    take: 4,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Benzer Urunler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((rp) => (
              <ProductCard
                key={rp.id}
                id={rp.id}
                name={rp.name}
                slug={rp.slug}
                price={rp.price}
                comparePrice={rp.comparePrice}
                image={rp.images[0]?.url || "/placeholder.jpg"}
                stock={rp.stock}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
