# 1Fi Product & Mutual Fund Backed EMI Platform

A full-stack web application built for the 1Fi SDE1 assessment. It displays smartphones with dynamic pricing and mutual-fund-backed EMI options, loading all product data, variants, and plans from a relational database through backend API routes.

---

## Tech Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Backend**: Next.js 16 (App Router Route Handlers)
- **Database**: Prisma ORM with SQLite (local) / PostgreSQL (production)
- **Language**: TypeScript

---

## Features

- **Dynamic Data**: All products, variants, images, specifications, and EMI plans are stored in the database and served via REST API routes.
- **Unique URLs**: Clean dynamic routes for each product:
  - `/products/iphone-17-pro`
  - `/products/samsung-s24-ultra`
  - `/products/google-pixel-9-pro`
- **Variant Selector**: Interactive color swatches and storage capacity options with real-time price and EMI updates.
- **Selectable EMI Plans**:
  - Monthly installment breakdown (e.g. 3, 6, 12, 24, 36, 48, 60 months)
  - 0% interest and 10.5% interest plans
  - Instant cashback indicators (e.g. ₹7,500 cashback)
  - Active selection states
- **Application & Pledge Flow**:
  - Modal workflow with PAN validation
  - Electronic mutual fund folio lien generation
  - Order creation in database via `POST /api/orders`

---

## Database Schema (`prisma/schema.prisma`)

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
  specs       String
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
  id                     String   @id @default(cuid())
  customerName           String
  customerEmail          String
  customerPhone          String
  panNumber              String
  productId              String
  product                Product  @relation(fields: [productId], references: [id])
  variantId              String
  variant                Variant  @relation(fields: [variantId], references: [id])
  emiPlanId              String
  tenureMonths           Int
  monthlyAmount          Float
  totalAmount            Float
  status                 String   @default("APPROVED")
  folioNumber            String?
  mutualFundUnitsPledged Float?
  createdAt              DateTime @default(now())
}
```

---

## API Endpoints

### 1. Get All Products
- **URL**: `GET /api/products`
- **Query Params**:
  - `brand` (optional): Filter by brand (`Apple`, `Samsung`, `Google`)
  - `search` (optional): Search name, brand, description
- **Response**:
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "cm...",
      "name": "Apple iPhone 17 Pro",
      "slug": "iphone-17-pro",
      "brand": "Apple",
      "basePrice": 127400,
      "baseMrp": 134900,
      "variants": [ ... ],
      "emiPlans": [ ... ]
    }
  ]
}
```

### 2. Get Product by Slug
- **URL**: `GET /api/products/:slug`
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "cm...",
    "name": "Apple iPhone 17 Pro",
    "slug": "iphone-17-pro",
    "brand": "Apple",
    "basePrice": 127400,
    "baseMrp": 134900,
    "variants": [
      {
        "id": "cm...v1",
        "name": "Cosmic Orange / 256 GB",
        "colorName": "Cosmic Orange",
        "colorHex": "#E08344",
        "storage": "256 GB",
        "price": 127400,
        "mrp": 134900
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
}
```

### 3. Create Application Order
- **URL**: `POST /api/orders`
- **Payload**:
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
- **Response**:
```json
{
  "success": true,
  "message": "Mutual Fund Pledged & EMI Plan Approved Successfully!",
  "data": {
    "id": "cm...order1",
    "customerName": "Aditya Sharma",
    "status": "APPROVED",
    "folioNumber": "1FI-873499",
    "mutualFundUnitsPledged": 2818.584,
    "tenureMonths": 12,
    "monthlyAmount": 11242,
    "totalAmount": 134904
  }
}
```

---

## Setup & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure `.env`**:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Initialize and seed database**:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Browse database visually (optional)**:
   ```bash
   npx prisma studio
   ```
