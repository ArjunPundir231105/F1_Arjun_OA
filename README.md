# 1Fi Store: Mutual Fund Backed Smartphones on 0% Interest EMI

> **1Fi SDE1 Online Assessment (OA)**  
> Full-Stack Web Application built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** (SQLite / PostgreSQL).

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)

---

## 📌 Problem & Concept Overview

Traditional consumer electronics financing forces customers to either liquidate their high-compounding investments or pay exorbitant 14%–18% p.a. credit card EMI interest. 

**1Fi** revolutionizes consumer financing by enabling customers to pledge their mutual fund portfolio as collateral:
1. **0% Interest EMIs**: Available in 3, 6, 12, and 24-month tenures with additional cashback up to **₹7,500**.
2. **Wealth Growth Retained**: Pledged mutual fund units stay invested in the market, continuing to compound at typical equity CAGRs (~12%–14% p.a.).
3. **Instant Electronic Lien**: Paperless verification via PAN through CAMS & KFintech registries with zero foreclosure penalties.

This application replicates and elevates the design and functionality demonstrated in the Snapmint / 1Fi assignment specification.

---

## 🚀 Live Demo & Features

### Core Capabilities
- **Dynamic Database Driven**: 100% of products, variants, images, specifications, and EMI plans are fetched dynamically from the database via REST API endpoints.
- **Unique Product URLs**:
  - `/products/iphone-17-pro` — Apple iPhone 17 Pro
  - `/products/samsung-s24-ultra` — Samsung Galaxy S24 Ultra
  - `/products/google-pixel-9-pro` — Google Pixel 9 Pro
- **Multi-Variant Switcher**:
  - Color / finish swatch selector (e.g. *Cosmic Orange*, *Natural Silver*, *Space Black*, *Deep Blue*).
  - Storage capacity selector (e.g. *256 GB*, *512 GB*, *1 TB*) with dynamic live price recalculation.
- **Dynamic EMI Plan List**:
  - Monthly payment amount (e.g. `₹44,967 x 3 months`, `₹22,483 x 6 months`, `₹11,242 x 12 months`, `₹5,621 x 24 months`, `₹4,297 x 36 months`, `₹3,385 x 48 months`, `₹2,842 x 60 months`).
  - Tenure indicator (in months).
  - Interest rate badge (`0% interest` or `10.5% interest`).
  - Additional cashback tag (`Additional cashback of ₹7,500`).
  - Active selection state with radio indicators.
- **Mutual Fund Growth Simulator**: Calculates the estimated market gains on the pledged amount throughout the chosen EMI tenure.
- **Interactive "Proceed" Application Flow**:
  - Applicant details input (Name, Email, Phone, PAN).
  - Simulated CAMS & KFintech PAN lookup and lien placement.
  - Confirmed order creation (`POST /api/orders`) with generated Folio and confetti celebration!

---

## 🛠️ Tech Stack Used

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | **Next.js 16 (App Router)** | Full-stack framework offering React Server Components, server-side dynamic routing, and fast Edge/Node.js API routes. |
| **Frontend UI** | **React 19 & Tailwind CSS v4** | Clean, responsive, glassmorphism design system matching 1Fi's official branding with Lucide icons. |
| **Backend API** | **Next.js Route Handlers** | RESTful endpoints (`/api/products`, `/api/products/[slug]`, `/api/orders`). |
| **Database ORM** | **Prisma ORM** | Type-safe query builder and migration tool with relational schema design. |
| **Database** | **SQLite (Local) / PostgreSQL (Prod)** | Zero-friction local setup (`dev.db`) with seamless migration path to PostgreSQL (Neon, Supabase, Render). |
| **Animations** | **Canvas Confetti & CSS3 Transitions** | Polished micro-interactions upon variant switching and order completion. |

---

## 🗄️ Database Schema (`prisma/schema.prisma`)

```prisma
model Product {
  id          String         @id @default(cuid())
  name        String
  slug        String         @unique
  brand       String
  category    String         @default("Smartphones")
  description String
  basePrice   Float
  baseMrp     Float
  rating      Float          @default(4.8)
  reviewCount Int            @default(1200)
  isNew       Boolean        @default(false)
  specs       String         // JSON string: chip, display, camera, battery, os
  variants    Variant[]
  emiPlans    EmiPlan[]
  orders      Order[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model Variant {
  id          String         @id @default(cuid())
  productId   String
  product     Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  name        String
  colorName   String
  colorHex    String
  storage     String
  price       Float
  mrp         Float
  stock       Int            @default(50)
  isAvailable Boolean        @default(true)
  sku         String         @unique
  images      ProductImage[]
  emiPlans    EmiPlan[]
  orders      Order[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model ProductImage {
  id        String   @id @default(cuid())
  variantId String
  variant   Variant  @relation(fields: [variantId], references: [id], onDelete: Cascade)
  url       String
  alt       String
  isPrimary Boolean  @default(false)
  order     Int      @default(0)
  createdAt DateTime @default(now())
}

model EmiPlan {
  id                     String   @id @default(cuid())
  productId              String
  product                Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  variantId              String?
  variant                Variant? @relation(fields: [variantId], references: [id], onDelete: Cascade)
  tenureMonths           Int
  monthlyAmount          Float
  interestRate           Float    @default(0.0)
  cashbackAmount         Float    @default(0.0)
  isZeroInterest         Boolean  @default(false)
  processingFee          Float    @default(0.0)
  mutualFundPledgeAmount Float
  highlightTag           String?
  createdAt              DateTime @default(now())
}

model Order {
  id                      String   @id @default(cuid())
  customerName            String
  customerEmail           String
  customerPhone           String
  panNumber               String
  productId               String
  product                 Product  @relation(fields: [productId], references: [id])
  variantId               String
  variant                 Variant  @relation(fields: [variantId], references: [id])
  emiPlanId               String
  tenureMonths            Int
  monthlyAmount           Float
  totalAmount             Float
  status                  String   @default("APPROVED")
  folioNumber             String?
  mutualFundUnitsPledged  Float?
  createdAt               DateTime @default(now())
}
```

---

## 📡 Backend API Endpoints

### 1. Get All Products
- **Endpoint**: `GET /api/products`
- **Query Params**:
  - `brand` (optional): Filter by brand (e.g. `Apple`, `Samsung`, `Google`)
  - `search` (optional): Full-text search in name, brand, description
- **Sample Request**:
  ```bash
  curl -X GET "http://localhost:3000/api/products?brand=Apple"
  ```
- **Sample Response**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "id": "cm...01",
        "name": "Apple iPhone 17 Pro",
        "slug": "iphone-17-pro",
        "brand": "Apple",
        "basePrice": 127400,
        "baseMrp": 134900,
        "rating": 4.9,
        "reviewCount": 1420,
        "isNew": true,
        "variants": [
          {
            "id": "cm...v1",
            "name": "Cosmic Orange / 256 GB",
            "colorName": "Cosmic Orange",
            "colorHex": "#E08344",
            "storage": "256 GB",
            "price": 127400,
            "mrp": 134900,
            "images": [
              {
                "url": "https://images.unsplash.com/photo-...",
                "isPrimary": true
              }
            ]
          }
        ],
        "emiPlans": [
          {
            "tenureMonths": 12,
            "monthlyAmount": 11242,
            "interestRate": 0,
            "cashbackAmount": 7500,
            "isZeroInterest": true
          }
        ]
      }
    ]
  }
  ```

---

### 2. Get Single Product by Slug or ID
- **Endpoint**: `GET /api/products/:slug`
- **Sample Request**:
  ```bash
  curl -X GET "http://localhost:3000/api/products/iphone-17-pro"
  ```
- **Sample Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "cm...01",
      "name": "Apple iPhone 17 Pro",
      "slug": "iphone-17-pro",
      "brand": "Apple",
      "basePrice": 127400,
      "baseMrp": 134900,
      "variants": [ ... ],
      "emiPlans": [
        {
          "id": "cm...p1",
          "tenureMonths": 3,
          "monthlyAmount": 44967,
          "interestRate": 0.0,
          "cashbackAmount": 7500,
          "isZeroInterest": true
        },
        {
          "id": "cm...p2",
          "tenureMonths": 6,
          "monthlyAmount": 22483,
          "interestRate": 0.0,
          "cashbackAmount": 7500,
          "isZeroInterest": true
        },
        {
          "id": "cm...p3",
          "tenureMonths": 12,
          "monthlyAmount": 11242,
          "interestRate": 0.0,
          "cashbackAmount": 7500,
          "isZeroInterest": true
        },
        {
          "id": "cm...p4",
          "tenureMonths": 24,
          "monthlyAmount": 5621,
          "interestRate": 0.0,
          "cashbackAmount": 7500,
          "isZeroInterest": true
        },
        {
          "id": "cm...p5",
          "tenureMonths": 36,
          "monthlyAmount": 4297,
          "interestRate": 10.5,
          "cashbackAmount": 7500,
          "isZeroInterest": false
        },
        {
          "id": "cm...p6",
          "tenureMonths": 48,
          "monthlyAmount": 3385,
          "interestRate": 10.5,
          "cashbackAmount": 7500,
          "isZeroInterest": false
        },
        {
          "id": "cm...p7",
          "tenureMonths": 60,
          "monthlyAmount": 2842,
          "interestRate": 10.5,
          "cashbackAmount": 7500,
          "isZeroInterest": false
        }
      ]
    }
  }
  ```

---

### 3. Create Application / Pledge Order
- **Endpoint**: `POST /api/orders`
- **Request Body**:
  ```json
  {
    "customerName": "Aditya Sharma",
    "customerEmail": "aditya@example.com",
    "customerPhone": "9876543210",
    "panNumber": "ABCDE1234F",
    "productId": "cm...",
    "variantId": "cm...",
    "emiPlanId": "cm...",
    "tenureMonths": 12,
    "monthlyAmount": 11242,
    "totalAmount": 134904
  }
  ```
- **Sample Response**:
  ```json
  {
    "success": true,
    "message": "Mutual Fund Pledged & EMI Plan Approved Successfully!",
    "data": {
      "id": "cm...order1",
      "customerName": "Aditya Sharma",
      "status": "APPROVED",
      "folioNumber": "1FI-839214",
      "mutualFundUnitsPledged": 2818.584,
      "tenureMonths": 12,
      "monthlyAmount": 11242,
      "totalAmount": 134904
    }
  }
  ```

---

## 💻 Local Setup & Run Instructions

### Prerequisites
- **Node.js**: v18+ (v20 or v22 recommended)
- **npm** or **pnpm**

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd 1fi-store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize and seed the database**:
   ```bash
   # Push schema to SQLite
   npx prisma db push

   # Seed products, variants, and EMI plans
   npx tsx prisma/seed.ts
   ```

5. **Start the local development server**:
   ```bash
   npm run dev
   ```

6. **Open in browser**:
   Visit [http://localhost:3000](http://localhost:3000) to view the catalog, or navigate directly to [http://localhost:3000/products/iphone-17-pro](http://localhost:3000/products/iphone-17-pro).

---

## 🌐 Production Deployment (Vercel / Render)

### Deploying on Vercel
1. Push your repository to GitHub.
2. Import project on [Vercel](https://vercel.com).
3. Connect a PostgreSQL database (such as **Neon**, **Supabase**, or **Vercel Postgres**):
   - In `prisma/schema.prisma`, update provider to `provider = "postgresql"`.
   - Set environment variable `DATABASE_URL="postgresql://..."`.
4. Run Build Command: `npx prisma generate && npx prisma db push && npx tsx prisma/seed.ts && next build`.

---

## 📄 License
Created for the 1Fi SDE1 Online Assessment.
