"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const statuses = Object.keys(ORDER_STATUS_MAP);

export function OrderStatusUpdate({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);

    if (res.ok) {
      toast.success("Siparis durumu guncellendi!");
      router.refresh();
    } else {
      toast.error("Guncelleme basarisiz.");
    }
  };

  return (
    <div className="flex gap-3">
      <Select value={status} onValueChange={(v) => setStatus(v ?? status)}>
        <SelectTrigger className="flex-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {ORDER_STATUS_MAP[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleUpdate} disabled={loading || status === currentStatus}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Guncelle
      </Button>
    </div>
  );
}
