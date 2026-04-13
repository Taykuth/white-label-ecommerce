"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/constants";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { brandConfig } from "../../../brand.config";
import type { Product, ProductImage, ProductVariant, Category } from "@prisma/client";

type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category | null;
};

export function ProductDetail({ product }: { product: ProductWithDetails }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const currentVariant = product.variants.find((v) => v.id === selectedVariant);
  const currentPrice = currentVariant?.price || product.price;
  const currentStock = currentVariant?.stock ?? product.stock;

  const handleAddToCart = () => {
    if (product.variants.length > 0 && !selectedVariant) {
      toast.error("Lutfen bir varyant secin");
      return;
    }
    addItem({
      id: "",
      productId: product.id,
      variantId: selectedVariant || undefined,
      name: product.name,
      variantName: currentVariant?.name,
      price: currentPrice,
      image: product.images[0]?.url || "/placeholder.jpg",
      quantity,
      stock: currentStock,
    });
    toast.success("Urun sepete eklendi!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Images */}
      <div>
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-4">
          {product.images[selectedImage] && (
            <Image
              src={product.images[selectedImage].url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
          {discount > 0 && (
            <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-500 text-base px-3 py-1">
              %{discount} Indirim
            </Badge>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(i)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                  i === selectedImage ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`${product.name} - ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        {product.category && (
          <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
        )}
        <h1 className="text-2xl lg:text-3xl font-bold mb-4">{product.name}</h1>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-bold text-primary">
            {formatPrice(currentPrice)}
          </span>
          {product.comparePrice && (
            <span className="text-xl text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="mb-6">
          {currentStock > 0 ? (
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              Stokta ({currentStock} adet)
            </Badge>
          ) : (
            <Badge variant="destructive">Tukendi</Badge>
          )}
        </div>

        {/* Variants */}
        {product.variants.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Secenekler</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  disabled={v.stock <= 0}
                  className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                    selectedVariant === v.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : v.stock <= 0
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 hover:border-primary"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Add to cart */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100"
            >
              <Minus size={18} />
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
            <button
              onClick={() =>
                setQuantity(Math.min(currentStock, quantity + 1))
              }
              className="p-2 hover:bg-gray-100"
            >
              <Plus size={18} />
            </button>
          </div>
          <Button
            size="lg"
            className="flex-1"
            disabled={currentStock <= 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2" size={20} />
            Sepete Ekle
          </Button>
        </div>

        {/* Features */}
        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Truck size={18} />
            <span>
              {brandConfig.shipping.freeShippingThreshold}{brandConfig.locale.currencySymbol} ustu ucretsiz kargo
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Shield size={18} />
            <span>Guvenli odeme altyapisi</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <RotateCcw size={18} />
            <span>14 gun iade garantisi</span>
          </div>
        </div>

        {/* Description */}
        <div className="border-t mt-6 pt-6">
          <h3 className="font-semibold mb-3">Urun Aciklamasi</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* SKU */}
        {product.sku && (
          <p className="text-xs text-gray-400 mt-4">SKU: {product.sku}</p>
        )}
      </div>
    </div>
  );
}
