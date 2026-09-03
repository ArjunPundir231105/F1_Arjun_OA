import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with products, variants, and EMI plans...");

  // Clean existing records
  await prisma.order.deleteMany();
  await prisma.emiPlan.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();

  // 1. Apple iPhone 17 Pro
  const iphone = await prisma.product.create({
    data: {
      name: "Apple iPhone 17 Pro",
      slug: "iphone-17-pro",
      brand: "Apple",
      category: "Smartphones",
      description:
        "Supercharged by the groundbreaking A19 Pro chip with 6-core GPU. Aerospace-grade titanium frame with polished contoured edges. Advanced 48MP Pro camera system with 5x optical telephoto, next-gen Photonic Engine, and Always-On Super Retina XDR display with ProMotion 120Hz.",
      basePrice: 127400,
      baseMrp: 134900,
      rating: 4.9,
      reviewCount: 1420,
      isNew: true,
      specs: JSON.stringify({
        display: '6.3" Super Retina XDR OLED with ProMotion (1-120Hz)',
        chip: "A19 Pro chip with 6-core CPU and 16-core Neural Engine",
        camera: "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto",
        battery: "Up to 29 hours video playback with MagSafe wireless fast charging",
        os: "iOS 19 with Apple Intelligence",
        weight: "199 grams",
      }),
      variants: {
        create: [
          {
            name: "Cosmic Orange / 256 GB",
            colorName: "Cosmic Orange",
            colorHex: "#E08344",
            storage: "256 GB",
            price: 127400,
            mrp: 134900,
            stock: 35,
            sku: "IP17P-256-ORG",
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
                  alt: "iPhone 17 Pro Cosmic Orange Front & Back",
                  isPrimary: true,
                  order: 1,
                },
                {
                  url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80",
                  alt: "iPhone 17 Pro Camera Detail",
                  isPrimary: false,
                  order: 2,
                },
                {
                  url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80",
                  alt: "iPhone 17 Pro Profile Titanium Edge",
                  isPrimary: false,
                  order: 3,
                },
              ],
            },
          },
          {
            name: "Natural Silver / 256 GB",
            colorName: "Natural Silver",
            colorHex: "#E3E4E8",
            storage: "256 GB",
            price: 127400,
            mrp: 134900,
            stock: 45,
            sku: "IP17P-256-SLV",
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1695048132938-f1c5058d92cb?auto=format&fit=crop&w=1000&q=80",
                  alt: "iPhone 17 Pro Natural Silver",
                  isPrimary: true,
                  order: 1,
                },
                {
                  url: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=1000&q=80",
                  alt: "iPhone 17 Pro Silver Angle",
                  isPrimary: false,
                  order: 2,
                },
              ],
            },
          },
          {
            name: "Space Black / 512 GB",
            colorName: "Space Black",
            colorHex: "#2C2D30",
            storage: "512 GB",
            price: 147400,
            mrp: 154900,
            stock: 20,
            sku: "IP17P-512-BLK",
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
                  alt: "iPhone 17 Pro Space Black",
                  isPrimary: true,
                  order: 1,
                },
              ],
            },
          },
          {
            name: "Deep Blue / 1 TB",
            colorName: "Deep Blue",
            colorHex: "#27384E",
            storage: "1 TB",
            price: 177400,
            mrp: 184900,
            stock: 12,
            sku: "IP17P-1TB-BLU",
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=1000&q=80",
                  alt: "iPhone 17 Pro Deep Blue",
                  isPrimary: true,
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
    include: { variants: true },
  });

  // Seed standard 1Fi Mutual Fund EMI plans for iPhone 17 Pro (matching reference table)
  const iphonePlans = [
    {
      tenureMonths: 3,
      monthlyAmount: 44967,
      interestRate: 0.0,
      cashbackAmount: 7500,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 150000,
      highlightTag: "Fast Payoff",
    },
    {
      tenureMonths: 6,
      monthlyAmount: 22483,
      interestRate: 0.0,
      cashbackAmount: 7500,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 150000,
      highlightTag: "Most Popular",
    },
    {
      tenureMonths: 12,
      monthlyAmount: 11242,
      interestRate: 0.0,
      cashbackAmount: 7500,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 150000,
      highlightTag: "Recommended (0% Interest)",
    },
    {
      tenureMonths: 24,
      monthlyAmount: 5621,
      interestRate: 0.0,
      cashbackAmount: 7500,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 150000,
      highlightTag: "0% Interest",
    },
    {
      tenureMonths: 36,
      monthlyAmount: 4297,
      interestRate: 10.5,
      cashbackAmount: 7500,
      isZeroInterest: false,
      processingFee: 499,
      mutualFundPledgeAmount: 160000,
      highlightTag: "Affordable Monthly",
    },
    {
      tenureMonths: 48,
      monthlyAmount: 3385,
      interestRate: 10.5,
      cashbackAmount: 7500,
      isZeroInterest: false,
      processingFee: 499,
      mutualFundPledgeAmount: 160000,
      highlightTag: "Extended Tenure",
    },
    {
      tenureMonths: 60,
      monthlyAmount: 2842,
      interestRate: 10.5,
      cashbackAmount: 7500,
      isZeroInterest: false,
      processingFee: 499,
      mutualFundPledgeAmount: 160000,
      highlightTag: "Lowest Monthly EMI",
    },
  ];

  for (const plan of iphonePlans) {
    await prisma.emiPlan.create({
      data: {
        ...plan,
        productId: iphone.id,
      },
    });
  }

  // 2. Samsung Galaxy S24 Ultra
  const samsung = await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24 Ultra 5G",
      slug: "samsung-s24-ultra",
      brand: "Samsung",
      category: "Smartphones",
      description:
        "Welcome to the era of mobile AI. Meet Galaxy S24 Ultra with a titanium exterior, built-in S Pen, and a revolutionary 200MP camera system. Features Circle to Search with Google, Live Translate, and Snapdragon 8 Gen 3 for Galaxy.",
      basePrice: 129999,
      baseMrp: 134999,
      rating: 4.8,
      reviewCount: 980,
      isNew: true,
      specs: JSON.stringify({
        display: '6.8" Dynamic AMOLED 2X QHD+ (1-120Hz Adaptive)',
        chip: "Snapdragon 8 Gen 3 Mobile Platform for Galaxy",
        camera: "200MP Wide + 50MP Periscope Telephoto + 12MP Ultra-Wide + 10MP 3x",
        battery: "5000 mAh with 45W Super Fast Charging 2.0",
        os: "One UI 6.1 with 7 years of OS & security updates",
        sPen: "Integrated Bluetooth S Pen included",
      }),
      variants: {
        create: [
          {
            name: "Titanium Gray / 256 GB",
            colorName: "Titanium Gray",
            colorHex: "#7E7F83",
            storage: "256 GB",
            price: 129999,
            mrp: 134999,
            stock: 30,
            sku: "S24U-256-GRY",
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80",
                  alt: "Samsung Galaxy S24 Ultra Gray",
                  isPrimary: true,
                  order: 1,
                },
                {
                  url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80",
                  alt: "Samsung Galaxy S24 Ultra Angle",
                  isPrimary: false,
                  order: 2,
                },
              ],
            },
          },
          {
            name: "Titanium Violet / 512 GB",
            colorName: "Titanium Violet",
            colorHex: "#5E5676",
            storage: "512 GB",
            price: 139999,
            mrp: 144999,
            stock: 25,
            sku: "S24U-512-VLT",
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80",
                  alt: "Samsung Galaxy S24 Ultra Violet",
                  isPrimary: true,
                  order: 1,
                },
              ],
            },
          },
          {
            name: "Titanium Black / 1 TB",
            colorName: "Titanium Black",
            colorHex: "#222325",
            storage: "1 TB",
            price: 159999,
            mrp: 164999,
            stock: 15,
            sku: "S24U-1TB-BLK",
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80",
                  alt: "Samsung Galaxy S24 Ultra Black",
                  isPrimary: true,
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
    include: { variants: true },
  });

  const samsungPlans = [
    {
      tenureMonths: 3,
      monthlyAmount: 45880,
      interestRate: 0.0,
      cashbackAmount: 6000,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 155000,
      highlightTag: "Quick Pay",
    },
    {
      tenureMonths: 6,
      monthlyAmount: 22940,
      interestRate: 0.0,
      cashbackAmount: 6000,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 155000,
      highlightTag: "Popular",
    },
    {
      tenureMonths: 12,
      monthlyAmount: 11470,
      interestRate: 0.0,
      cashbackAmount: 6000,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 155000,
      highlightTag: "Recommended (0% Interest)",
    },
    {
      tenureMonths: 24,
      monthlyAmount: 5735,
      interestRate: 0.0,
      cashbackAmount: 6000,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 155000,
      highlightTag: "0% Interest",
    },
    {
      tenureMonths: 36,
      monthlyAmount: 4380,
      interestRate: 10.5,
      cashbackAmount: 6000,
      isZeroInterest: false,
      processingFee: 499,
      mutualFundPledgeAmount: 165000,
      highlightTag: "Flexible",
    },
    {
      tenureMonths: 48,
      monthlyAmount: 3450,
      interestRate: 10.5,
      cashbackAmount: 6000,
      isZeroInterest: false,
      processingFee: 499,
      mutualFundPledgeAmount: 165000,
      highlightTag: "Lowest Monthly",
    },
  ];

  for (const plan of samsungPlans) {
    await prisma.emiPlan.create({
      data: {
        ...plan,
        productId: samsung.id,
      },
    });
  }

  // 3. Google Pixel 9 Pro
  const pixel = await prisma.product.create({
    data: {
      name: "Google Pixel 9 Pro 5G",
      slug: "google-pixel-9-pro",
      brand: "Google",
      category: "Smartphones",
      description:
        "The most powerful Pixel yet. Powered by Google Tensor G4 with 16GB of RAM, engineered to run Google's most advanced AI models. Featuring a redesigned polished metal frame with silky matte glass back, Super Actua display, and pro camera controls.",
      basePrice: 109999,
      baseMrp: 114999,
      rating: 4.7,
      reviewCount: 760,
      isNew: true,
      specs: JSON.stringify({
        display: '6.3" Super Actua display (1-120Hz OLED, up to 3000 nits)',
        chip: "Google Tensor G4 with Titan M2 security coprocessor",
        camera: "50MP Octa PD Wide + 48MP Quad PD Ultrawide + 48MP 5x Telephoto",
        battery: "4700 mAh with 24+ hour battery life, Extreme Battery Saver up to 100 hrs",
        os: "Android 15 with 7 years of Pixel Drops & OS updates",
        ai: "Gemini Live, Magic Editor, Best Take, Pixel Studio built-in",
      }),
      variants: {
        create: [
          {
            name: "Porcelain (White) / 256 GB",
            colorName: "Porcelain",
            colorHex: "#F2EFEB",
            storage: "256 GB",
            price: 109999,
            mrp: 114999,
            stock: 28,
            sku: "PX9P-256-POR",
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80",
                  alt: "Google Pixel 9 Pro Porcelain Front",
                  isPrimary: true,
                  order: 1,
                },
                {
                  url: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1000&q=80",
                  alt: "Google Pixel 9 Pro Angle",
                  isPrimary: false,
                  order: 2,
                },
              ],
            },
          },
          {
            name: "Obsidian (Black) / 512 GB",
            colorName: "Obsidian",
            colorHex: "#232324",
            storage: "512 GB",
            price: 124999,
            mrp: 129999,
            stock: 20,
            sku: "PX9P-512-OBS",
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1000&q=80",
                  alt: "Google Pixel 9 Pro Obsidian Black",
                  isPrimary: true,
                  order: 1,
                },
              ],
            },
          },
          {
            name: "Hazel (Sage) / 256 GB",
            colorName: "Hazel",
            colorHex: "#72776E",
            storage: "256 GB",
            price: 109999,
            mrp: 114999,
            stock: 18,
            sku: "PX9P-256-HZL",
            images: {
              create: [
                {
                  url: "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=1000&q=80",
                  alt: "Google Pixel 9 Pro Hazel",
                  isPrimary: true,
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
    include: { variants: true },
  });

  const pixelPlans = [
    {
      tenureMonths: 3,
      monthlyAmount: 38810,
      interestRate: 0.0,
      cashbackAmount: 5000,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 130000,
      highlightTag: "Quick Pay",
    },
    {
      tenureMonths: 6,
      monthlyAmount: 19405,
      interestRate: 0.0,
      cashbackAmount: 5000,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 130000,
      highlightTag: "Popular",
    },
    {
      tenureMonths: 12,
      monthlyAmount: 9702,
      interestRate: 0.0,
      cashbackAmount: 5000,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 130000,
      highlightTag: "Recommended (0% Interest)",
    },
    {
      tenureMonths: 24,
      monthlyAmount: 4851,
      interestRate: 0.0,
      cashbackAmount: 5000,
      isZeroInterest: true,
      processingFee: 0,
      mutualFundPledgeAmount: 130000,
      highlightTag: "0% Interest",
    },
    {
      tenureMonths: 36,
      monthlyAmount: 3707,
      interestRate: 10.5,
      cashbackAmount: 5000,
      isZeroInterest: false,
      processingFee: 399,
      mutualFundPledgeAmount: 140000,
      highlightTag: "Lowest Monthly",
    },
  ];

  for (const plan of pixelPlans) {
    await prisma.emiPlan.create({
      data: {
        ...plan,
        productId: pixel.id,
      },
    });
  }

  console.log("Database seeded successfully with 3 products, variants, and EMI plans!");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
