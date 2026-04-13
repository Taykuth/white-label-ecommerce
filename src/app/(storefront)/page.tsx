import { db } from "@/lib/db";
import { HeroBanner } from "@/components/storefront/hero-banner";
import { ProductCard } from "@/components/storefront/product-card";
import { CategoryCard } from "@/components/storefront/category-card";
import { brandConfig } from "../../../brand.config";
import { Truck, Shield, Clock, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    db.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      take: brandConfig.homepage.featuredProductCount,
    }),
    db.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <HeroBanner />

      {/* Trust badges */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 justify-center">
              <Truck className="text-primary shrink-0" size={24} />
              <div className="text-sm">
                <p className="font-medium">Ucretsiz Kargo</p>
                <p className="text-gray-500">{brandConfig.shipping.freeShippingThreshold}{brandConfig.locale.currencySymbol} ustu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Shield className="text-primary shrink-0" size={24} />
              <div className="text-sm">
                <p className="font-medium">Guvenli Odeme</p>
                <p className="text-gray-500">256-bit SSL</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Clock className="text-primary shrink-0" size={24} />
              <div className="text-sm">
                <p className="font-medium">Hizli Teslimat</p>
                <p className="text-gray-500">{brandConfig.shipping.estimatedDeliveryDays} is gunu</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <CreditCard className="text-primary shrink-0" size={24} />
              <div className="text-sm">
                <p className="font-medium">Taksit Imkani</p>
                <p className="text-gray-500">12 aya varan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Kategoriler</h2>
          <Link href="/urunler">
            <Button variant="ghost">Tumunu Gor &rarr;</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              image={cat.image}
              productCount={cat._count.products}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">One Cikan Urunler</h2>
            <Link href="/urunler">
              <Button variant="ghost">Tumunu Gor &rarr;</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                comparePrice={product.comparePrice}
                image={product.images[0]?.url || "/placeholder.jpg"}
                stock={product.stock}
                isFeatured={product.isFeatured}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{brandConfig.storeSlogan}</h2>
          <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">
            {brandConfig.storeDescription}
          </p>
          <Link href="/urunler">
            <Button size="lg" variant="secondary">
              Hemen Alisverise Basla
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
