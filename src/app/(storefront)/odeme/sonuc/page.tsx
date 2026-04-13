import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/constants";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentResultPage({ searchParams }: Props) {
  const session = await auth();
  if (!session) redirect("/giris");

  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <XCircle className="mx-auto text-red-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold mb-2">Siparis Bulunamadi</h1>
        <p className="text-gray-500 mb-6">Gecersiz siparis bilgisi.</p>
        <Link href="/urunler">
          <Button>Alisverise Devam Et</Button>
        </Link>
      </div>
    );
  }

  const order = await db.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: { items: true },
  });

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <XCircle className="mx-auto text-red-500 mb-4" size={64} />
        <h1 className="text-2xl font-bold mb-2">Siparis Bulunamadi</h1>
        <Link href="/urunler">
          <Button>Alisverise Devam Et</Button>
        </Link>
      </div>
    );
  }

  const isSuccess = order.paymentStatus === "PAID" || order.status !== "CANCELLED";

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-lg">
      {isSuccess ? (
        <>
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-2xl font-bold mb-2">Siparisiz Alindi!</h1>
          <p className="text-gray-500 mb-2">
            Siparis numaraniz: <strong>{order.orderNumber}</strong>
          </p>
          <p className="text-gray-500 mb-6">
            Toplam: <strong>{formatPrice(order.total)}</strong>
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Siparis detaylariniz email adresinize gonderilecektir.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/hesabim/siparisler">
              <Button>Siparislerimi Gor</Button>
            </Link>
            <Link href="/urunler">
              <Button variant="outline">Alisverise Devam Et</Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <XCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h1 className="text-2xl font-bold mb-2">Odeme Basarisiz</h1>
          <p className="text-gray-500 mb-6">
            Odeme islemi tamamlanamadi. Lutfen tekrar deneyin.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/sepet">
              <Button>Sepete Don</Button>
            </Link>
            <Link href="/urunler">
              <Button variant="outline">Alisverise Devam Et</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
