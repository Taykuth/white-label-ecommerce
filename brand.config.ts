export const brandConfig = {
  // === KIMLIK ===
  storeName: "ModaVitrin",
  storeSlogan: "Tarzinizi Yansitan Magazaniz",
  storeDescription: "Turkiye'nin en modern online alisveris platformu. Kaliteli urunler, guvenli odeme, hizli teslimat.",
  logoText: "ModaVitrin",
  faviconPath: "/brands/default/favicon.ico",

  // === ILETISIM ===
  contact: {
    email: "info@modavitrin.com",
    phone: "+90 212 555 00 00",
    whatsapp: "+905551234567",
    address: "Levent, Buyukdere Cad. No:123, Besiktas/Istanbul",
  },

  // === SOSYAL MEDYA ===
  social: {
    instagram: "https://instagram.com/modavitrin",
    twitter: "",
    facebook: "",
    youtube: "",
  },

  // === TEMA RENKLERI ===
  theme: {
    primary: "#1a1a2e",
    primaryLight: "#16213e",
    accent: "#e94560",
    accentLight: "#ff6b6b",
    background: "#ffffff",
    foreground: "#1a1a2e",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    border: "#e2e8f0",
    success: "#22c55e",
    warning: "#f59e0b",
  },

  // === OZELLIKLER ===
  features: {
    darkMode: false,
    guestCheckout: true,
    productVariants: true,
    whatsappButton: true,
    cookieConsent: true,
    installments: true,
  },

  // === YERELLESTIME ===
  locale: {
    currency: "TRY",
    currencySymbol: "\u20BA",
    language: "tr",
  },

  // === KARGO ===
  shipping: {
    freeShippingThreshold: 500,
    defaultShippingCost: 39.99,
    estimatedDeliveryDays: "2-4",
  },

  // === ANASAYFA ===
  homepage: {
    heroBanners: [
      {
        title: "Yeni Sezon Koleksiyonu",
        subtitle: "En trend urunler simdi cok ozel fiyatlarla",
        buttonText: "Alisverise Basla",
        buttonLink: "/urunler",
        bgColor: "from-slate-900 to-slate-700",
      },
      {
        title: "Yaz Indirimi Basladi!",
        subtitle: "%50'ye varan indirimlerle yaz koleksiyonu",
        buttonText: "Indirimleri Gor",
        buttonLink: "/urunler?sort=discount",
        bgColor: "from-rose-600 to-pink-500",
      },
    ],
    featuredProductCount: 8,
  },

  // === SEO ===
  seo: {
    titleTemplate: "%s | ModaVitrin",
    defaultTitle: "ModaVitrin - Online Alisveris",
    defaultDescription: "Kaliteli urunler, guvenli odeme, hizli teslimat. Turkiye'nin en modern online alisveris platformu.",
  },

  // === YASAL ===
  legal: {
    companyName: "ModaVitrin Elektronik Ticaret A.S.",
    taxNumber: "1234567890",
    mersisNo: "0123456789012345",
    kvkkText: "Kisisel verileriniz 6698 sayili Kisisel Verilerin Korunmasi Kanunu kapsaminda islenecek ve korunacaktir.",
  },
} as const;

export type BrandConfig = typeof brandConfig;
