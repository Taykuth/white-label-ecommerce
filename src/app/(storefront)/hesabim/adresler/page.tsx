"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TURKISH_CITIES } from "@/lib/constants";
import { Plus, Trash2, MapPin, Loader2 } from "lucide-react";
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
  zipCode?: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { data: session } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    name: "",
    surname: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    zipCode: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const res = await fetch("/api/addresses");
    if (res.ok) {
      const data = await res.json();
      setAddresses(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Adres eklendi!");
      setShowForm(false);
      setForm({ title: "", name: "", surname: "", phone: "", address: "", city: "", district: "", zipCode: "" });
      fetchAddresses();
    } else {
      toast.error("Adres eklenemedi.");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Adres silindi!");
      fetchAddresses();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Adreslerim</h1>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Yeni Adres
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Adres Basligi</Label>
                <Input
                  placeholder="Orn: Ev, Is"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
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
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Kaydet
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Iptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">Henuz kayitli adresiniz yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card key={addr.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{addr.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {addr.name} {addr.surname}
                    </p>
                    <p className="text-sm text-gray-600">{addr.address}</p>
                    <p className="text-sm text-gray-600">
                      {addr.district} / {addr.city}
                    </p>
                    <p className="text-sm text-gray-600">{addr.phone}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
