export interface ProductImage {
  id: string;
  variantId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface Variant {
  id: string;
  productId: string;
  name: string;
  colorName: string;
  colorHex: string;
  storage: string;
  price: number;
  mrp: number;
  stock: number;
  isAvailable: boolean;
  sku: string;
  images: ProductImage[];
}

export interface EmiPlan {
  id: string;
  productId: string;
  variantId?: string | null;
  tenureMonths: number;
  monthlyAmount: number;
  interestRate: number;
  cashbackAmount: number;
  isZeroInterest: boolean;
  processingFee: number;
  mutualFundPledgeAmount: number;
  highlightTag?: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  basePrice: number;
  baseMrp: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  specs: string; // JSON string
  variants: Variant[];
  emiPlans: EmiPlan[];
}

export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  panNumber: string;
  productId: string;
  variantId: string;
  emiPlanId: string;
  tenureMonths: number;
  monthlyAmount: number;
  totalAmount: number;
}
