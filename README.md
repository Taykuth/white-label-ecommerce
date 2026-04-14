# White-Label E-Ticaret Platformu

Firmalara ve markalara özel, tek kod tabanından yönetilen, Türk pazarına uyumlu modern bir e-ticaret platformu.

Demo marka: **ModaVitrin**

---

## Öne Çıkan Özellikler

### Mağaza (Storefront)
- Modern, mobil uyumlu arayüz (Tailwind CSS + shadcn/ui)
- Anasayfa: hero slider, öne çıkan ürünler, kategori vitrini
- Ürün listeleme: filtreleme, sıralama, sayfalama
- Ürün detay: galeri, varyant seçimi, stok durumu, sepete ekleme
- Ürün arama (`/arama`)
- Sepet: miktar yönetimi, ücretsiz kargo göstergesi (Zustand + localStorage)
- Üyelik: kayıt, giriş, oturum yönetimi (NextAuth.js v5)
- Hesabım: profil, siparişlerim, adres defteri
- Çıkış (checkout): adres seçimi, sipariş özeti, iyzico ödeme entegrasyonu
- KVKK çerez onayı, WhatsApp iletişim butonu

### Yönetim Paneli (`/admin`)
- Dashboard: satış istatistikleri, son siparişler
- Ürün yönetimi: ekle / düzenle / sil, görsel yükleme, varyant
- Kategori yönetimi (ağaç yapısı)
- Sipariş yönetimi: durum güncelleme (Hazırlanıyor → Kargoda → Teslim edildi)
- Müşteri listesi
- Ayarlar sayfası
- Rol tabanlı erişim (middleware ile korunan rotalar)

### Türkiye Pazarı Uyumu
- Türkçe URL yapısı (`/urunler`, `/sepet`, `/odeme`, `/hesabim`, `/giris`, `/kayit`)
- TL formatı (1.250,00 ₺)
- 81 il dropdown'ı
- iyzico Checkout Form (3DS, taksit, kart kaydı)
- KVKK metin şablonu
- Mesafeli satış sözleşmesi altyapısı

---

## Tek Tıkla Çalıştırma

Windows için: projenin kök dizinindeki **`start.bat`** dosyasına çift tıklayın.

Script otomatik olarak şunları yapar:
1. Node.js kurulu mu kontrol eder
2. `node_modules` yoksa bağımlılıkları kurar (`npm install`)
3. Veritabanı yoksa migration çalıştırır ve demo verileri yükler
4. Geliştirme sunucusunu başlatır (`npm run dev`)
5. 5 saniye sonra tarayıcıda `http://localhost:3000` açılır

Manuel başlatma:

```bash
npm install
npx prisma migrate deploy
npm run seed
npm run dev
```


---

## Yeni Marka İçin Özelleştirme

Bir müşteriye satacağınız site için şu adımları izleyin:

### 1. Marka Kimliği — `brand.config.ts`

Tek dosya düzenleyerek tüm site yeniden markalanır:

```ts
export const brandConfig = {
  storeName: "YeniMarka",
  storeSlogan: "Markanızın sloganı",
  logoText: "YeniMarka",

  contact: {
    email: "info@yenimarka.com",
    phone: "+90 xxx xxx xx xx",
    whatsapp: "+90xxxxxxxxxx",
    address: "Adres bilgisi",
  },

  theme: {
    primary: "#1a1a2e",      // Ana renk
    accent: "#e94560",       // Vurgu rengi
    // ... diğer renkler
  },

  features: {
    whatsappButton: true,
    cookieConsent: true,
    installments: true,
    // ...
  },

  shipping: {
    freeShippingThreshold: 500,   // TL
    defaultShippingCost: 39.99,
  },
  // ...
};
```

`theme.colors` içindeki HSL renkleri değiştirince header, butonlar, rozetler, vurgular — tüm site otomatik güncellenir.

### 2. Ürünler, Kategoriler, Siparişler

Admin panelinden (`/admin`) yönetin. Toplu demo veri için `prisma/seed.ts` düzenleyip `npm run seed` çalıştırın.

### 3. Logo ve Görseller

`public/brands/default/` klasörüne logo, favicon ve kampanya görsellerini koyun.

---

## Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui |
| Veritabanı | Prisma + SQLite (demo) / PostgreSQL (prod) |
| Auth | NextAuth.js v5 |
| Ödeme | iyzico (Checkout Form) |
| Form / Validasyon | React Hook Form + Zod |
| State | Zustand (sepet) |
| Bildirim | Sonner |
| İkonlar | Lucide React |

---

## Proje Yapısı

```
.
├── brand.config.ts              # Marka kişiselleştirme (tek dosya)
├── start.bat                    # Tek tıkla çalıştırma (Windows)
├── prisma/
│   ├── schema.prisma            # Veritabanı şeması
│   ├── seed.ts                  # Demo veriler (ürün, kategori, kullanıcı)
│   └── migrations/
├── public/
│   └── brands/default/          # Logo, favicon, kampanya görselleri
└── src/
    ├── app/
    │   ├── (storefront)/        # Mağaza sayfaları
    │   │   ├── page.tsx         # Anasayfa
    │   │   ├── urunler/         # Ürün listeleme + detay
    │   │   ├── kategori/        # Kategori sayfaları
    │   │   ├── sepet/           # Sepet
    │   │   ├── odeme/           # Checkout + sonuç
    │   │   ├── hesabim/         # Hesap sayfaları
    │   │   ├── giris/           # Login
    │   │   ├── kayit/           # Register
    │   │   └── arama/           # Arama sonuçları
    │   ├── (admin)/admin/       # Yönetim paneli
    │   └── api/                 # API routes
    ├── components/
    │   ├── ui/                  # shadcn/ui bileşenleri
    │   ├── layout/              # Header, Footer
    │   ├── storefront/          # Mağaza bileşenleri
    │   ├── admin/               # Yönetim bileşenleri
    │   └── shared/              # Ortak bileşenler
    ├── lib/                     # auth, db, iyzico, brand, utils
    ├── hooks/                   # use-cart, use-brand
    ├── types/                   # TypeScript tipleri
    └── middleware.ts            # Rota koruma
```

---

## Veritabanı Modelleri

- **User** — email, password (bcrypt), name, phone, role (CUSTOMER / ADMIN)
- **Category** — ağaç yapısı (parent-child)
- **Product** — name, slug, price, comparePrice, stock, images, variants
- **ProductImage** — url, alt, sortOrder
- **ProductVariant** — name, sku, price, stock, options (JSON)
- **CartItem** — user veya session tabanlı
- **Order** — sipariş numarası, durum, tutarlar, iyzico alanları, adres snapshot
- **OrderItem** — ürün snapshot, miktar, fiyat
- **Address** — başlık, isim, telefon, adres, il, ilçe

---

## Ödeme Akışı (iyzico)

1. Müşteri "Ödemeye Geç" butonuna tıklar
2. Server sepeti doğrular, fiyatları DB'den alır (client'a güvenmez)
3. PENDING sipariş oluşturulur, `checkoutFormInitialize` çağrılır
4. Client iyzico formunu render eder (3DS, taksit, kart kaydı)
5. iyzico callback URL'e POST yapar
6. Server ödemeyi doğrular, siparişi günceller, stok düşer, sepet temizlenir

> Sandbox test için `.env` içindeki `IYZICO_API_KEY` ve `IYZICO_SECRET_KEY` değerlerini iyzico sandbox kimliğinizle değiştirin.

---

## Ortam Değişkenleri (`.env`)

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
IYZICO_API_KEY="sandbox-api-key"
IYZICO_SECRET_KEY="sandbox-secret-key"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"
```

Örnek: `.env.example`

---

## NPM Script'leri

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm start` | Production sunucusu |
| `npm run lint` | ESLint |
| `npm run seed` | Demo verileri yükle |

---

## Production Deploy

1. `DATABASE_URL`'i PostgreSQL bağlantı adresiyle değiştirin
2. `prisma/schema.prisma` içindeki provider'ı `postgresql` yapın
3. `npm run build` ile build alın
4. Vercel, Railway, Hetzner veya kendi sunucunuza deploy edin
5. iyzico üretim anahtarlarını girin
6. `NEXTAUTH_URL`'i production domain ile güncelleyin
