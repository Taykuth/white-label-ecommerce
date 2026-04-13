import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brandConfig } from "../../../../../brand.config";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Magaza Bilgileri</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Magaza Adi:</span>
              <p className="font-medium">{brandConfig.storeName}</p>
            </div>
            <div>
              <span className="text-gray-500">Slogan:</span>
              <p className="font-medium">{brandConfig.storeSlogan}</p>
            </div>
            <div>
              <span className="text-gray-500">Aciklama:</span>
              <p className="font-medium">{brandConfig.storeDescription}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Iletisim</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-medium">{brandConfig.contact.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Telefon:</span>
              <p className="font-medium">{brandConfig.contact.phone}</p>
            </div>
            <div>
              <span className="text-gray-500">WhatsApp:</span>
              <p className="font-medium">{brandConfig.contact.whatsapp}</p>
            </div>
            <div>
              <span className="text-gray-500">Adres:</span>
              <p className="font-medium">{brandConfig.contact.address}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Kargo Ayarlari</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Ucretsiz Kargo Limiti:</span>
              <p className="font-medium">{brandConfig.shipping.freeShippingThreshold} {brandConfig.locale.currencySymbol}</p>
            </div>
            <div>
              <span className="text-gray-500">Varsayilan Kargo Ucreti:</span>
              <p className="font-medium">{brandConfig.shipping.defaultShippingCost} {brandConfig.locale.currencySymbol}</p>
            </div>
            <div>
              <span className="text-gray-500">Tahmini Teslimat:</span>
              <p className="font-medium">{brandConfig.shipping.estimatedDeliveryDays} is gunu</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Yasal Bilgiler</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Sirket Adi:</span>
              <p className="font-medium">{brandConfig.legal.companyName}</p>
            </div>
            <div>
              <span className="text-gray-500">Vergi No:</span>
              <p className="font-medium">{brandConfig.legal.taxNumber}</p>
            </div>
            <div>
              <span className="text-gray-500">MERSIS No:</span>
              <p className="font-medium">{brandConfig.legal.mersisNo}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Not:</strong> Bu ayarlar <code className="bg-blue-100 px-1 rounded">brand.config.ts</code> dosyasindan okunmaktadir.
          Degisiklik yapmak icin bu dosyayi duzenleyin ve uygulamayi yeniden baslayin.
        </p>
      </div>
    </div>
  );
}
