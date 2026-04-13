"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, TURKISH_CITIES } from "@/lib/constants";
import { brandConfig } from "../../../../brand.config";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Address {
  id: string;
  title: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
  city: string;
  district: string;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [form, setForm] = useState({
    name: "", surname: "", phone: "", address: "", city: "", district: "",
  });

  const total = getTotal();
  const shippingCost = total >= brandConfig.shipping.freeShippingThreshold ? 0 : brandConfig.shipping.defaultShippingCost;
  const grandTotal = total + shippingCost;

  useEffect(() => {
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((data) => {
        setAddresses(data);
        if (data.length > 0) {
          const defaultAddr = data.find((a: Address & { isDefault?: boolean }) => a.isDefault) || data[0];
          setSelectedAddress(defaultAddr.id);
        } else {
          setUseNewAddress(true);
        }
      });
  }, []);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Sepetiniz bos.</p>
        <Button onClick={() => router.push("/urunler")}>Alisverise Basla</Button>
      </div>
    );
  }

  const handleOrder = async () => {
    setLoading(true);

    let shippingData;
    if (useNewAddress) {
      if (!form.name || !form.surname || !form.phone || !form.address || !form.city || !form.district) {
        toast.error("Lutfen tum adres bilgilerini doldurun.");
        setLoading(false);
        return;
      }
      shippingData = {
        shippingName: `${form.name} ${form.surname}`,
        shippingAddress: form.address,
        shippingCity: `${form.district} / ${form.city}`,
        shippingPhone: form.phone,
      };
    } else {
      const addr = addresses.find((a) => a.id === selectedAddress);
      if (!addr) {
        toast.error("Lutfen bir adres secin.");
        setLoading(false);
        return;
      }
      shippingData = {
        shippingName: `${addr.name} ${addr.surname}`,
        shippingAddress: addr.address,
        shippingCity: `${addr.district} / ${addr.city}`,
        shippingPhone: addr.phone,
      };
    }

    try {
      const res = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          ...shippingData,
          billingName: shippingData.shippingName,
          billingAddress: shippingData.shippingAddress,
          billingCity: shippingData.shippingCity,
          billingPhone: shippingData.shippingPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Siparis olusturulamadi.");
        setLoading(false);
        return;
      }

      clearCart();
      router.push(`/odeme/sonuc?orderId=${data.orderId}`);
    } catch {
      toast.error("Bir hata olustu. Lutfen tekrar deneyin.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Odeme</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Address section */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Teslimat Adresi</h2>

          {addresses.length > 0 && !useNewAddress && (
            <div className="space-y-3 mb-4">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddress === addr.id ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddress === addr.id}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">{addr.title}</p>
                    <p className="text-sm text-gray-600">
                      {addr.name} {addr.surname} - {addr.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.address}, {addr.district}/{addr.city}
                    </p>
                  </div>
                </label>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUseNewAddress(true)}
              >
                Yeni Adres Kullan
              </Button>
            </div>
          )}

          {useNewAddress && (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ad</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <Label>Soyad</Label>
                  <Input value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label>Telefon</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div>
                <Label>Adres</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Il</Label>
                  <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v ?? "" })}>
                    <SelectTrigger><SelectValue placeholder="Il secin" /></SelectTrigger>
                    <SelectContent>
                      {TURKISH_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ilce</Label>
                  <Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required />
                </div>
              </div>
              {addresses.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setUseNewAddress(false)}>
                  Kayitli Adresten Sec
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="font-semibold mb-4">Siparis Ozeti</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-12 h-12 rounded bg-gray-200 shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} adet</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Ara Toplam</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kargo</span>
                <span className={shippingCost === 0 ? "text-green-600" : ""}>
                  {shippingCost === 0 ? "Ucretsiz" : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-base">
                <span>Toplam</span>
                <span className="text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handleOrder}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Siparisi Onayla
            </Button>

            <p className="text-xs text-gray-400 mt-3 text-center">
              Siparisi onaylayarak mesafeli satis sozlesmesini kabul etmis olursunuz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
