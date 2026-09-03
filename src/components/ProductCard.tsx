import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Star, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryVariant = product.variants?.[0];
  const primaryImage =
    primaryVariant?.images?.find((img) => img.isPrimary)?.url ||
    primaryVariant?.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80";

  // Find lowest monthly EMI plan
  const lowestEmiPlan = product.emiPlans?.reduce((prev, curr) => {
    return curr.monthlyAmount < prev.monthlyAmount ? curr : prev;
  }, product.emiPlans[0]);

  // Calculate discount
  const discountPercent = Math.round(
    ((product.baseMrp - product.basePrice) / product.baseMrp) * 100
  );

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col">
      {/* Product Image Container */}
      <div className="relative bg-slate-50 p-6 flex items-center justify-center aspect-square overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-rose-500 text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md tracking-wider">
              NEW
            </span>
          )}
          <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            0% EMI Backed
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1 shadow-sm z-10">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{product.rating}</span>
          <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
        </div>

        {/* Image */}
        <Link href={`/products/${product.slug}`} className="w-full h-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Available finishes indicator */}
        {product.variants && product.variants.length > 0 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
            <span className="text-[10px] text-slate-500 font-medium">
              {product.variants.length} finishes
            </span>
            <div className="flex items-center gap-1">
              {product.variants.slice(0, 4).map((v) => (
                <span
                  key={v.id}
                  className="w-2.5 h-2.5 rounded-full border border-slate-300"
                  style={{ backgroundColor: v.colorHex }}
                  title={v.colorName}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-1">
          {product.brand}
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900">
              {formatCurrency(product.basePrice)}
            </span>
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(product.baseMrp)}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {discountPercent}% OFF
            </span>
          </div>

          {/* EMI Highlight Card */}
          {lowestEmiPlan && (
            <div className="mt-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-2.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wide block">
                  Mutual Fund Backed EMI
                </span>
                <span className="text-xs font-extrabold text-slate-900">
                  from {formatCurrency(lowestEmiPlan.monthlyAmount)}/mo
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                0% Available
              </span>
            </div>
          )}

          {/* View Plans CTA */}
          <Link
            href={`/products/${product.slug}`}
            className="mt-3 w-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 group-hover:bg-indigo-600"
          >
            <span>View EMI Plans</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
