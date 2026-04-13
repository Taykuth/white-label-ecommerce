import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin kullanici
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@modavitrin.com" },
    update: {},
    create: {
      email: "admin@modavitrin.com",
      passwordHash: adminPassword,
      name: "Admin",
      surname: "Yonetici",
      phone: "+905551234567",
      role: "ADMIN",
    },
  });

  // Demo musteri
  const customerPassword = await hash("musteri123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "musteri@example.com" },
    update: {},
    create: {
      email: "musteri@example.com",
      passwordHash: customerPassword,
      name: "Ahmet",
      surname: "Yilmaz",
      phone: "+905559876543",
      role: "CUSTOMER",
    },
  });

  // Adres
  await prisma.address.create({
    data: {
      userId: customer.id,
      title: "Ev",
      name: "Ahmet",
      surname: "Yilmaz",
      phone: "+905559876543",
      address: "Ataturk Mah. Cumhuriyet Cad. No:42 Daire:5",
      city: "Istanbul",
      district: "Kadikoy",
      zipCode: "34710",
      isDefault: true,
    },
  });

  // Kategoriler
  const elektronik = await prisma.category.create({
    data: {
      name: "Elektronik",
      slug: "elektronik",
      description: "Telefon, bilgisayar, tablet ve daha fazlasi",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
      sortOrder: 1,
    },
  });

  const giyim = await prisma.category.create({
    data: {
      name: "Giyim",
      slug: "giyim",
      description: "Kadin, erkek ve cocuk giyim urunleri",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      sortOrder: 2,
    },
  });

  const evYasam = await prisma.category.create({
    data: {
      name: "Ev & Yasam",
      slug: "ev-yasam",
      description: "Ev dekorasyon, mutfak ve banyo urunleri",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      sortOrder: 3,
    },
  });

  const spor = await prisma.category.create({
    data: {
      name: "Spor & Outdoor",
      slug: "spor-outdoor",
      description: "Spor giyim, ekipman ve outdoor urunleri",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      sortOrder: 4,
    },
  });

  const kozmetik = await prisma.category.create({
    data: {
      name: "Kozmetik",
      slug: "kozmetik",
      description: "Cilt bakim, makyaj ve parfum urunleri",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      sortOrder: 5,
    },
  });

  const aksesuar = await prisma.category.create({
    data: {
      name: "Aksesuar",
      slug: "aksesuar",
      description: "Canta, saat, gunes gozlugu ve daha fazlasi",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      sortOrder: 6,
    },
  });

  // Urunler
  const products = [
    {
      name: "Kablosuz Bluetooth Kulaklik",
      slug: "kablosuz-bluetooth-kulaklik",
      description: "Yuksek ses kalitesi, 30 saat pil omru, aktif gurultu engelleme ozellikli kablosuz kulaklik. Bluetooth 5.3 destegi ile kesintisiz baglanti. Ergonomik tasarimi ile uzun sureli kullanim konforu saglar.",
      price: 1299.99,
      comparePrice: 1799.99,
      sku: "ELK-001",
      stock: 50,
      categoryId: elektronik.id,
      isFeatured: true,
      tags: "kulaklik,bluetooth,kablosuz,muzik",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop",
      ],
    },
    {
      name: "Akilli Saat Pro",
      slug: "akilli-saat-pro",
      description: "AMOLED ekran, kalp ritmi olcum, SpO2 takibi, GPS ve 100+ spor modu. 7 gun pil omru. Su gecirmez (5ATM). iOS ve Android uyumlu.",
      price: 2499.99,
      comparePrice: 3299.99,
      sku: "ELK-002",
      stock: 30,
      categoryId: elektronik.id,
      isFeatured: true,
      tags: "saat,akilli saat,fitness,saglik",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&h=600&fit=crop",
      ],
    },
    {
      name: "Premium Deri Ceket",
      slug: "premium-deri-ceket",
      description: "Gercek kuzu derisi, el yapimi dikis detaylari. Slim fit kesim, ic astari satin. Her mevsim giyilebilir klasik tasarim.",
      price: 4599.99,
      comparePrice: 5999.99,
      sku: "GYM-001",
      stock: 15,
      categoryId: giyim.id,
      isFeatured: true,
      tags: "ceket,deri,erkek,kadin",
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600&h=600&fit=crop",
      ],
    },
    {
      name: "Oversize Sweatshirt",
      slug: "oversize-sweatshirt",
      description: "Organik pamuk, rahat oversize kalip. Unisex tasarim. Yumusak ic yuzeyi ile konforu hissedin. Maskinede yikanabilir.",
      price: 599.99,
      comparePrice: 899.99,
      sku: "GYM-002",
      stock: 100,
      categoryId: giyim.id,
      isFeatured: true,
      tags: "sweatshirt,oversize,unisex,pamuk",
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&h=600&fit=crop",
      ],
    },
    {
      name: "El Yapimi Seramik Vazo",
      slug: "el-yapimi-seramik-vazo",
      description: "Turkiye'nin en iyi seramik ustalari tarafindan el yapimi. Dogal toprak tonlari. Yukseklik: 30cm. Her biri essiz.",
      price: 349.99,
      comparePrice: null,
      sku: "EV-001",
      stock: 25,
      categoryId: evYasam.id,
      isFeatured: true,
      tags: "vazo,seramik,dekorasyon,el yapimi",
      images: [
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=600&fit=crop",
      ],
    },
    {
      name: "Profesyonel Yoga Mati",
      slug: "profesyonel-yoga-mati",
      description: "6mm kalinlik, anti-kayma yuzey, dogal kaucuk malzeme. Tasinabilir kayis hediye. Tum yoga stilleri icin uygun.",
      price: 449.99,
      comparePrice: 599.99,
      sku: "SPR-001",
      stock: 60,
      categoryId: spor.id,
      isFeatured: true,
      tags: "yoga,mat,spor,fitness",
      images: [
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop",
      ],
    },
    {
      name: "Dogal Cilt Bakim Seti",
      slug: "dogal-cilt-bakim-seti",
      description: "Temizleyici, tonik, nemlendirici ve serum iceren 4'lu set. %100 dogal icerik, paraben ve sulfat icermez. Tum cilt tipleri icin.",
      price: 899.99,
      comparePrice: 1199.99,
      sku: "KZM-001",
      stock: 40,
      categoryId: kozmetik.id,
      isFeatured: true,
      tags: "cilt bakim,dogal,serum,nemlendirici",
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1570194065650-d99fb4d38e3a?w=600&h=600&fit=crop",
      ],
    },
    {
      name: "Deri Sirt Cantasi",
      slug: "deri-sirt-cantasi",
      description: "Gercek deri, laptop bolmesi (15.6 inc), su gecirmez fermuarlar. Is ve gunluk kullanim icin ideal. Ergonomik sirt destegi.",
      price: 1899.99,
      comparePrice: 2499.99,
      sku: "AKS-001",
      stock: 20,
      categoryId: aksesuar.id,
      isFeatured: true,
      tags: "canta,sirt cantasi,deri,laptop",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=600&fit=crop",
      ],
    },
    {
      name: "Minimalist Kol Saati",
      slug: "minimalist-kol-saati",
      description: "Safir cam, Japon mekanizma, gercek deri kayis. Kasa capi: 40mm. Su gecirmez (3ATM). 2 yil garanti.",
      price: 1599.99,
      comparePrice: null,
      sku: "AKS-002",
      stock: 35,
      categoryId: aksesuar.id,
      isFeatured: false,
      tags: "saat,minimalist,klasik,deri",
      images: [
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop",
      ],
    },
    {
      name: "Kosu Ayakkabisi Ultra",
      slug: "kosu-ayakkabisi-ultra",
      description: "Hafif ve nefes alabilen mesh yuzey, jel tabanlik teknolojisi. Her zeminde ustun tutunum. Hem yol hem parkur icin uygun.",
      price: 1799.99,
      comparePrice: 2199.99,
      sku: "SPR-002",
      stock: 45,
      categoryId: spor.id,
      isFeatured: false,
      tags: "ayakkabi,kosu,spor,fitness",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
      ],
    },
    {
      name: "Pamuklu Nevresim Takimi",
      slug: "pamuklu-nevresim-takimi",
      description: "200 iplik sayisi, %100 Turk pamugu. Cift kisilik set: nevresim, carsaf, 4 yastik kilifi. Maskinede yikanabilir.",
      price: 1099.99,
      comparePrice: 1499.99,
      sku: "EV-002",
      stock: 30,
      categoryId: evYasam.id,
      isFeatured: false,
      tags: "nevresim,pamuk,yatak,ev tekstil",
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1631049035182-249067d7618e?w=600&h=600&fit=crop",
      ],
    },
    {
      name: "Parfum - Gece Esintisi",
      slug: "parfum-gece-esintisi",
      description: "Ust notalar: bergamot, siyah biber. Orta notalar: iris, yasemin. Alt notalar: sandal agaci, misk. EDP 100ml.",
      price: 749.99,
      comparePrice: 999.99,
      sku: "KZM-002",
      stock: 55,
      categoryId: kozmetik.id,
      isFeatured: false,
      tags: "parfum,koku,hediye",
      images: [
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1594035910387-fea081ac60c4?w=600&h=600&fit=crop",
      ],
    },
  ];

  for (const p of products) {
    const { images, ...productData } = p;
    const product = await prisma.product.create({
      data: productData,
    });
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          url: images[i],
          alt: productData.name,
          sortOrder: i,
          productId: product.id,
        },
      });
    }
  }

  // Varyantlar icin ornek: Oversize Sweatshirt
  const sweatshirt = await prisma.product.findUnique({ where: { slug: "oversize-sweatshirt" } });
  if (sweatshirt) {
    const variants = [
      { name: "Siyah / S", sku: "GYM-002-S-BLK", stock: 20, options: '{"renk":"Siyah","beden":"S"}' },
      { name: "Siyah / M", sku: "GYM-002-M-BLK", stock: 25, options: '{"renk":"Siyah","beden":"M"}' },
      { name: "Siyah / L", sku: "GYM-002-L-BLK", stock: 20, options: '{"renk":"Siyah","beden":"L"}' },
      { name: "Beyaz / S", sku: "GYM-002-S-WHT", stock: 15, options: '{"renk":"Beyaz","beden":"S"}' },
      { name: "Beyaz / M", sku: "GYM-002-M-WHT", stock: 10, options: '{"renk":"Beyaz","beden":"M"}' },
      { name: "Beyaz / L", sku: "GYM-002-L-WHT", stock: 10, options: '{"renk":"Beyaz","beden":"L"}' },
    ];
    for (const v of variants) {
      await prisma.productVariant.create({
        data: { ...v, productId: sweatshirt.id },
      });
    }
  }

  console.log("Seed tamamlandi!");
  console.log(`Admin: admin@modavitrin.com / admin123`);
  console.log(`Musteri: musteri@example.com / musteri123`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
