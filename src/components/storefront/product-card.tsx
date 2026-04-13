"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/constants";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  image: string;
  stock: number;
  isFeatured?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  image,
  stock,
  isFeatured,
}: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);

  const discount = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock <= 0) return;
    addItem({
      id: "",
      productId: id,
      name,
      price,
      image,
      quantity: 1,
      stock,
    });
    toast.success("Urun sepete eklendi!");
  };

  return (
    <Link href={`/urunler/${slug}`} className="group">
      <div className="bg-white rounded-lg border overflow-hidden transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-500">
              %{discount}
            </Badge>
          )}
          {stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Tukendi</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </span>
            {comparePrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="w-full mt-3"
            disabled={stock <= 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {stock > 0 ? "Sepete Ekle" : "Tukendi"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
