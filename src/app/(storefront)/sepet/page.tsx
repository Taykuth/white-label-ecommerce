"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/constants";
import { brandConfig } from "../../../../brand.config";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const total = getTotal();
  const shippingCost =
    total >= brandConfig.shipping.freeShippingThreshold
      ? 0
      : brandConfig.shipping.defaultShippingCost;
  const freeShippingRemaining = brandConfig.shipping.freeShippingThreshold - total;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto mb-4 text-gray-300" size={64} />
        <h1 className="text-2xl font-bold mb-2">Sepetiniz Bos</h1>
        <p className="text-gray-500 mb-6">
          Hemen alisverise baslayin ve sepetinizi doldurun!
        </p>
        <Link href="/urunler">
          <Button size="lg">Alisverise Basla</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Sepetim ({items.length} urun)</h1>

      {/* Free shipping bar */}
      {freeShippingRemaining > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Ucretsiz kargo icin{" "}
            <strong>{formatPrice(freeShippingRemaining)}</strong> daha ekleyin!
          </p>
          <div className="mt-2 bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(100, (total / brandConfig.shipping.freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
      {freeShippingRemaining <= 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800 font-medium">
            Tebrikler! Ucretsiz kargo kazandiniz!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border rounded-lg"
            >
              <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-50 shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{item.name}</h3>
                {item.variantName && (
                  <p className="text-xs text-gray-500">{item.variantName}</p>
                )}
                <p className="text-sm font-bold text-primary mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    className="p-1 hover:bg-gray-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 text-sm">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        Math.min(item.stock, item.quantity + 1)
                      )
                    }
                    className="p-1 hover:bg-gray-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="text-sm font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-24">
          <h2 className="font-semibold mb-4">Siparis Ozeti</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ara Toplam</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kargo</span>
              <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                {shippingCost === 0 ? "Ucretsiz" : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-base">
              <span>Toplam</span>
              <span className="text-primary">{formatPrice(total + shippingCost)}</span>
            </div>
          </div>
          <Link href="/odeme" className="block mt-6">
            <Button className="w-full" size="lg">
              Odemeye Gec
            </Button>
          </Link>
          <Link
            href="/urunler"
            className="block text-center text-sm text-gray-500 hover:text-primary mt-3"
          >
            Alisverise Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
}
