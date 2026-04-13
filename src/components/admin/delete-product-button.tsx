"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`"${productName}" urununu silmek istediginize emin misiniz?`)) return;

    setLoading(true);
    const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    setLoading(false);

    if (res.ok) {
      toast.success("Urun silindi!");
      router.refresh();
    } else {
      toast.error("Urun silinemedi.");
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  );
}
