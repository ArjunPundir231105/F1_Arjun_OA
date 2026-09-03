import React from "react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{
    brand?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const brand = resolvedParams.brand || "all";
  const search = resolvedParams.search || "";
  const sort = resolvedParams.sort || "newest";

  const whereClause: Record<string, unknown> = {};

  if (brand && brand !== "all") {
    whereClause.brand = { equals: brand };
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { brand: { contains: search } },
      { description: { contains: search } },
    ];
  }

  let orderByClause: Record<string, "asc" | "desc"> = { createdAt: "desc" };
  if (sort === "price_asc") {
    orderByClause = { basePrice: "asc" };
  } else if (sort === "price_desc") {
    orderByClause = { basePrice: "desc" };
  } else if (sort === "rating") {
    orderByClause = { rating: "desc" };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      variants: {
        include: {
          images: {
            orderBy: { order: "asc" },
          },
        },
      },
      emiPlans: {
        orderBy: { tenureMonths: "asc" },
      },
    },
    orderBy: orderByClause,
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>1Fi Device Financing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
              Get Flagship Gadgets On EMI{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Backed by Your Mutual Funds
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Keep your investments compounding in the market while you pay easy monthly EMIs with 0% interest.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 0% Interest Plans (3–24 Mos)
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Portfolio Stays Invested
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> CAMS & KFintech Verified
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Available Flagships
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Explore flagships eligible for 0% interest EMI and cashback rewards.
              </p>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { label: "All Brands", value: "all" },
                  { label: "Apple", value: "Apple" },
                  { label: "Samsung", value: "Samsung" },
                  { label: "Google", value: "Google" },
                  { label: "OnePlus", value: "OnePlus" },
                  { label: "Xiaomi", value: "Xiaomi" },
                  { label: "Nothing", value: "Nothing" },
                ].map((item) => {
                  const isActive = brand === item.value;
                  const query = new URLSearchParams();
                  if (item.value !== "all") query.set("brand", item.value);
                  if (search) query.set("search", search);
                  if (sort !== "newest") query.set("sort", sort);
                  const href = query.toString() ? `/?${query.toString()}` : "/";

                  return (
                    <Link
                      key={item.value}
                      href={href}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs shrink-0 self-start sm:self-auto">
                <span className="text-[11px] font-semibold text-slate-400 pl-2 pr-1">Sort:</span>
                {[
                  { label: "Newest", value: "newest" },
                  { label: "Price: Low to High", value: "price_asc" },
                  { label: "Price: High to Low", value: "price_desc" },
                  { label: "Top Rated", value: "rating" },
                ].map((s) => {
                  const isActive = sort === s.value;
                  const query = new URLSearchParams();
                  if (brand !== "all") query.set("brand", brand);
                  if (search) query.set("search", search);
                  if (s.value !== "newest") query.set("sort", s.value);
                  const href = query.toString() ? `/?${query.toString()}` : "/";

                  return (
                    <Link
                      key={s.value}
                      href={href}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        isActive
                          ? "bg-slate-900 text-white font-semibold"
                          : "text-slate-600 hover:text-slate-950"
                      }`}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No products found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                No gadgets match your selected filter criteria.
              </p>
              <Link
                href="/"
                className="inline-block bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Reset Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}
        </section>

        {/* 1Fi Unique Comparison Section */}
        <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Financial Smarts
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Why 1Fi Mutual Fund EMI Beats Traditional Credit
              </h2>
              <p className="text-xs text-slate-500 max-w-xl mx-auto mt-2">
                See how keeping your money invested in compounding equity while paying monthly EMI puts you far ahead financially.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Interest Rate</th>
                    <th className="p-4">Cash Outflow</th>
                    <th className="p-4">Your Investment Wealth</th>
                    <th className="p-4">Credit Score Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-indigo-50/60 font-semibold text-slate-900 border-l-4 border-indigo-600">
                    <td className="p-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-indigo-600" />
                      <span>1Fi Mutual Fund Backed EMI</span>
                    </td>
                    <td className="p-4 text-emerald-700 font-bold">0% Interest</td>
                    <td className="p-4">Split into easy monthly payments</td>
                    <td className="p-4 text-indigo-700 font-bold">
                      Keeps compounding at ~12% CAGR
                    </td>
                    <td className="p-4 text-emerald-700">Protected & Improved</td>
                  </tr>
                  <tr className="text-slate-600">
                    <td className="p-4">Selling Mutual Funds / Cash</td>
                    <td className="p-4">0%</td>
                    <td className="p-4 text-rose-600 font-medium">100% upfront loss of capital</td>
                    <td className="p-4 text-rose-600 font-medium">Lost compounding forever</td>
                    <td className="p-4">None</td>
                  </tr>
                  <tr className="text-slate-600">
                    <td className="p-4">Standard Credit Card EMI</td>
                    <td className="p-4 text-rose-600 font-medium">14% - 18% p.a.</td>
                    <td className="p-4">High monthly processing + interest</td>
                    <td className="p-4">No wealth generated</td>
                    <td className="p-4">High credit utilization risk</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              3-Step Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How 1Fi Mutual Fund Pledging Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Pick Your Gadget & EMI Plan</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose any flagship phone with 3, 6, 12, or 24-month 0% interest EMI tenures. Enjoy up to ₹7,500 cashback.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Lien-Mark via CAMS / KFintech</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your PAN. Our API securely detects your mutual fund portfolio and places an electronic lien. Your units remain in your folio.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Instant Dispatch & Auto-Debit</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your device is dispatched immediately. Pay low monthly EMIs while your mutual funds continue to compound and grow.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
