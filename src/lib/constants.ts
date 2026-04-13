export const TURKISH_CITIES = [
  "Adana", "Adiyaman", "Afyonkarahisar", "Agri", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin",
  "Aydin", "Balikesir", "Bartin", "Batman", "Bayburt", "Bilecik", "Bingol", "Bitlis", "Bolu", "Burdur",
  "Bursa", "Canakkale", "Cankiri", "Corum", "Denizli", "Diyarbakir", "Duzce", "Edirne", "Elazig", "Erzincan",
  "Erzurum", "Eskisehir", "Gaziantep", "Giresun", "Gumushane", "Hakkari", "Hatay", "Igdir", "Isparta", "Istanbul",
  "Izmir", "Kahramanmaras", "Karabuk", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kilis", "Kirikkale", "Kirklareli",
  "Kirsehir", "Kocaeli", "Konya", "Kutahya", "Malatya", "Manisa", "Mardin", "Mersin", "Mugla", "Mus",
  "Nevsehir", "Nigde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Sanliurfa", "Siirt", "Sinop",
  "Sirnak", "Sivas", "Tekirdag", "Tokat", "Trabzon", "Tunceli", "Usak", "Van", "Yalova", "Yozgat", "Zonguldak",
] as const;

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Beklemede", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Onaylandi", color: "bg-blue-100 text-blue-800" },
  PREPARING: { label: "Hazirlaniyor", color: "bg-purple-100 text-purple-800" },
  SHIPPED: { label: "Kargoda", color: "bg-indigo-100 text-indigo-800" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Iptal Edildi", color: "bg-red-100 text-red-800" },
  REFUNDED: { label: "Iade Edildi", color: "bg-gray-100 text-gray-800" },
};

export const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Beklemede", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "Odendi", color: "bg-green-100 text-green-800" },
  FAILED: { label: "Basarisiz", color: "bg-red-100 text-red-800" },
  REFUNDED: { label: "Iade Edildi", color: "bg-gray-100 text-gray-800" },
};

export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(num);
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `SIP-${year}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}
