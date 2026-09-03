"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Product, Variant, EmiPlan } from "@/types";
import { formatCurrency, calculateDynamicEmi, calculateMfReturns } from "@/lib/utils";
import ProceedModal from "@/components/ProceedModal";
import {
  Star,
  ShieldCheck,
  TrendingUp,
  Check,
  ChevronRight,
  Sparkles,
  Info,
  Gift,
  ArrowRight,
  Layers,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  // State for selected variant
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.[0]?.id || ""
  );

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find((v) => v.id === selectedVariantId) ||
      product.variants[0]
    );
  }, [product.variants, selectedVariantId]);

  // Gallery image selection
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Group unique colors and unique storages from variants
  const colorOptions = useMemo(() => {
    const map = new Map<string, { name: string; hex: string; variantId: string }>();
    product.variants.forEach((v) => {
      if (!map.has(v.colorName)) {
        map.set(v.colorName, {
          name: v.colorName,
          hex: v.colorHex,
          variantId: v.id,
        });
      }
    });
    return Array.from(map.values());
  }, [product.variants]);

  const storageOptions = useMemo(() => {
    const storages = new Set<string>();
    product.variants.forEach((v) => storages.add(v.storage));
    return Array.from(storages);
  }, [product.variants]);

  // Handle color change: find variant with same storage or first matching color
  const handleColorChange = (colorName: string) => {
    const matched =
      product.variants.find(
        (v) => v.colorName === colorName && v.storage === selectedVariant.storage
      ) || product.variants.find((v) => v.colorName === colorName);

    if (matched) {
      setSelectedVariantId(matched.id);
      setActiveImageIndex(0);
    }
  };

  // Handle storage change: find variant with same color and target storage
  const handleStorageChange = (storage: string) => {
    const matched =
      product.variants.find(
        (v) => v.storage === storage && v.colorName === selectedVariant.colorName
      ) || product.variants.find((v) => v.storage === storage);

    if (matched) {
      setSelectedVariantId(matched.id);
      setActiveImageIndex(0);
    }
  };

  // Selected EMI Plan state (default to 12 months or first plan)
  const defaultPlan =
    product.emiPlans.find((p) => p.tenureMonths === 12) ||
    product.emiPlans[0];
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    defaultPlan?.id || ""
  );

  // Filter tabs for plans
  const [planFilter, setPlanFilter] = useState<"all" | "zero" | "long">("all");

  const filteredPlans = useMemo(() => {
    if (planFilter === "zero") {
      return product.emiPlans.filter((p) => p.isZeroInterest);
    }
    if (planFilter === "long") {
      return product.emiPlans.filter((p) => p.tenureMonths >= 36);
    }
    return product.emiPlans;
  }, [product.emiPlans, planFilter]);

  const selectedPlan = useMemo(() => {
    return (
      product.emiPlans.find((p) => p.id === selectedPlanId) ||
      product.emiPlans[0]
    );
  }, [product.emiPlans, selectedPlanId]);

  // Calculate dynamic monthly EMI based on selected variant price
  const dynamicMonthlyAmount = useMemo(() => {
    if (!selectedPlan || !selectedVariant) return 0;
    // If base price equals variant price, use plan's monthlyAmount; otherwise recalculate accurately
    if (selectedVariant.price === product.basePrice) {
      return selectedPlan.monthlyAmount;
    }
    return calculateDynamicEmi(
      selectedVariant.price,
      selectedPlan.tenureMonths,
      selectedPlan.interestRate
    );
  }, [selectedVariant, selectedPlan, product.basePrice]);

  // Estimated Mutual Fund returns calculation
  const pledgeAmount = Math.round(selectedVariant.price * 1.15);
  const mfReturnEstimate = useMemo(() => {
    if (!selectedPlan) return { futureValue: 0, gain: 0 };
    return calculateMfReturns(pledgeAmount, selectedPlan.tenureMonths);
  }, [pledgeAmount, selectedPlan]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active Images
  const currentImages = selectedVariant.images?.length
    ? selectedVariant.images
    : [
        {
          id: "placeholder",
          url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
          alt: product.name,
          isPrimary: true,
          order: 0,
        },
      ];

  const activeImage = currentImages[activeImageIndex] || currentImages[0];

  // Parse specs if available
  let parsedSpecs: Record<string, string> = {};
  try {
    parsedSpecs = JSON.parse(product.specs || "{}");
  } catch (e) {
    parsedSpecs = {};
  }

  // Savings calculation
  const savings = selectedVariant.mrp - selectedVariant.price;
  const savingsPercent = Math.round((savings / selectedVariant.mrp) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb matching Snapmint style */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap font-medium">
        <Link href="/" className="hover:text-indigo-600">
          Shop on EMI
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/?category=smartphones" className="hover:text-indigo-600">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href={`/?brand=${product.brand}`} className="hover:text-indigo-600">
          {product.brand}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">
          {product.name} ({selectedVariant.colorName}, {selectedVariant.storage})
        </span>
      </nav>

      {/* Main Grid: Left (Product Showcase) & Right (EMI Plans & Pricing) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* ================= LEFT COLUMN: Product Gallery & Specs ================= */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="sticky top-24 space-y-6">
            {/* Gallery Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col">
              {/* Product Header Badges */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {product.isNew && (
                    <span className="bg-rose-500 text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      NEW
                    </span>
                  )}
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {product.brand}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">
                    ({product.reviewCount})
                  </span>
                </div>
              </div>

              {/* Title & Storage Subheading */}
              <div className="mb-4">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-sm font-semibold text-slate-600 mt-0.5">
                  {selectedVariant.storage} • {selectedVariant.colorName}
                </p>
              </div>

              {/* Main Image Display */}
              <div className="relative aspect-square w-full max-w-sm mx-auto flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage.url}
                  alt={activeImage.alt}
                  className="max-h-full max-w-full object-contain drop-shadow-md transition-all duration-300 hover:scale-105"
                />
              </div>

              {/* Finishes Swatch Selector (Matching Reference: "Available in 3 finishes") */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center">
                <span className="text-xs font-semibold text-slate-500 mb-2">
                  Available in {colorOptions.length} finishes
                </span>
                <div className="flex items-center gap-3">
                  {colorOptions.map((opt) => {
                    const isSelected = selectedVariant.colorName === opt.name;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => handleColorChange(opt.name)}
                        className={`group relative p-1 rounded-full transition-all ${
                          isSelected
                            ? "ring-2 ring-indigo-600 ring-offset-2 scale-110"
                            : "hover:scale-105"
                        }`}
                        title={opt.name}
                      >
                        <span
                          className="block w-6 h-6 rounded-full shadow-inner border border-slate-300"
                          style={{ backgroundColor: opt.hex }}
                        />
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-sm">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-slate-800 mt-1.5">
                  {selectedVariant.colorName}
                </span>
              </div>

              {/* Thumbnail strip if multiple images exist */}
              {currentImages.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  {currentImages.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-12 h-12 rounded-lg border p-1 transition-all overflow-hidden flex items-center justify-center ${
                        activeImageIndex === idx
                          ? "border-indigo-600 ring-2 ring-indigo-100"
                          : "border-slate-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="max-h-full max-w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Storage Options Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Select Storage Capacity
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {storageOptions.map((storage) => {
                  const isSelected = selectedVariant.storage === storage;
                  // Look up variant for this storage
                  const variantForStorage = product.variants.find(
                    (v) => v.storage === storage
                  );
                  return (
                    <button
                      key={storage}
                      onClick={() => handleStorageChange(storage)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold ring-2 ring-indigo-600/20 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-sm font-bold block">{storage}</span>
                      {variantForStorage && (
                        <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                          {formatCurrency(variantForStorage.price)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hardware Specifications */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>Device Specifications</span>
              </h4>
              <div className="space-y-2 text-xs">
                {Object.entries(parsedSpecs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-1.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="capitalize font-medium text-slate-500">
                      {key}
                    </span>
                    <span className="font-semibold text-slate-800 text-right max-w-[65%]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Price & EMI Plans (Matches Reference) ================= */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Top Price Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(selectedVariant.price)}
              </span>
              <span className="text-base text-slate-400 line-through">
                {formatCurrency(selectedVariant.mrp)}
              </span>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                Save {formatCurrency(savings)} ({savingsPercent}% OFF)
              </span>
            </div>

            {/* Subtitle matching reference: "EMI plans backed by mutual funds" */}
            <div className="mt-3 flex items-center gap-2">
              <h2 className="text-base font-bold text-indigo-950">
                EMI plans backed by mutual funds
              </h2>
              <span
                className="group relative cursor-pointer text-indigo-600 hover:text-indigo-800"
                title="Your mutual fund units are pledged electronically via CAMS/KFintech. Your funds stay invested and earn compounding returns!"
              >
                <Info className="w-4 h-4" />
              </span>
            </div>

            {/* 1Fi Wealth Compounding Banner */}
            <div className="mt-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
                    Mutual Fund Growth Advantage
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Estimated Gain: +{formatCurrency(mfReturnEstimate.gain)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  While you pay{" "}
                  <strong>
                    {formatCurrency(dynamicMonthlyAmount)}/mo for {selectedPlan.tenureMonths} months
                  </strong>
                  , your pledged folio (~{formatCurrency(pledgeAmount)}) continues to grow at market CAGR, potentially generating{" "}
                  <strong className="text-emerald-700">+{formatCurrency(mfReturnEstimate.gain)}</strong> in investment wealth!
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mt-6 flex items-center gap-2 border-b border-slate-100 pb-3">
              <button
                onClick={() => setPlanFilter("all")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  planFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                All EMI Plans ({product.emiPlans.length})
              </button>
              <button
                onClick={() => setPlanFilter("zero")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  planFilter === "zero"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                0% Interest Plans
              </button>
              <button
                onClick={() => setPlanFilter("long")}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  planFilter === "long"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Longer Tenures (36–60 Mos)
              </button>
            </div>

            {/* Available EMI Plans List (Directly Matching PDF Reference Structure) */}
            <div className="mt-4 space-y-3">
              {filteredPlans.map((plan) => {
                const isSelected = selectedPlan.id === plan.id;
                // Calculate variant-adjusted monthly amount
                const monthly =
                  selectedVariant.price === product.basePrice
                    ? plan.monthlyAmount
                    : calculateDynamicEmi(
                        selectedVariant.price,
                        plan.tenureMonths,
                        plan.interestRate
                      );

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/30 shadow-md ring-1 ring-indigo-600"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    {/* Top Row: Monthly x Tenure on Left, Interest Rate on Right */}
                    <div className="flex items-center justify-between">
                      {/* Left: Radio & EMI Calculation */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-extrabold text-slate-900">
                              {formatCurrency(monthly)}
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                              x {plan.tenureMonths} months
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Interest Rate Badge */}
                      <div className="text-right">
                        <span
                          className={`inline-block text-xs font-bold px-2.5 py-1 rounded-md ${
                            plan.isZeroInterest
                              ? "text-emerald-700 bg-emerald-100/80 font-extrabold"
                              : "text-slate-700 bg-slate-100"
                          }`}
                        >
                          {plan.interestRate}% interest
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Cashback Information Tag */}
                    {plan.cashbackAmount > 0 && (
                      <div className="mt-2.5 pl-8 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <Gift className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Additional cashback of {formatCurrency(plan.cashbackAmount)}</span>
                      </div>
                    )}

                    {/* Highlight Badge if any */}
                    {plan.highlightTag && (
                      <div className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
                        {plan.highlightTag}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Bottom Summary & Proceed Button */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg sticky bottom-4 z-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  Selected Plan Breakdown
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold text-indigo-700">
                    {formatCurrency(dynamicMonthlyAmount)}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    / month for {selectedPlan.tenureMonths} mos
                  </span>
                  <span className="text-xs text-slate-400">
                    ({selectedPlan.interestRate}% Interest)
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-medium">
                  <span className="text-emerald-600 font-bold">✓ ₹0 Downpayment</span>
                  <span>•</span>
                  <span>Mutual Fund Lien: ~{formatCurrency(pledgeAmount)}</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 text-sm sm:text-base group hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Proceed with Selected Plan</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* FAQ / Trust Information */}
          <div className="bg-slate-100/70 rounded-2xl border border-slate-200 p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1Fi Guarantee
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>No hidden charges or foreclosure penalties.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Mutual fund units remain strictly in your name.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Instant lien release upon completing tenure.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>All mutual fund dividends & returns accrue to you.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Proceed & Pledge Modal */}
      <ProceedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        selectedVariant={selectedVariant}
        selectedPlan={selectedPlan}
        monthlyAmount={dynamicMonthlyAmount}
      />
    </div>
  );
}
