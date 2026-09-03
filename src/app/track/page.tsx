"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Package,
  Calendar,
  CreditCard,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Lock,
} from "lucide-react";

interface OrderData {
  id: string;
  customerName: string;
  customerEmail: string;
  panNumber: string;
  tenureMonths: number;
  monthlyAmount: number;
  totalAmount: number;
  status: string;
  folioNumber: string;
  mutualFundUnitsPledged: number;
  createdAt: string;
  product: {
    name: string;
    brand: string;
    slug: string;
  };
  variant: {
    name: string;
    colorName: string;
    storage: string;
    price: number;
  };
}

function TrackContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [query, setQuery] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "No matching application found");
      }

      setOrder(data.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load order details";
      setError(message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(query);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
      <div className="mb-8 text-center max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your EMI & Lien Status
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Enter your Order ID, Folio Number, or registered PAN to view your mutual fund pledge details.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Order ID, 1FI-873499, or PAN..."
              className="w-full bg-white border border-slate-300 rounded-2xl py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-colors shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
          </button>
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 mb-8">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Details Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in duration-200">
          {/* Status Header */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {order.status}
                </span>
                <span className="text-xs text-indigo-200">
                  Lien Marked via CAMS & KFintech
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Order #{order.id.slice(0, 14)}...
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-300 block">Monthly Installment:</span>
              <span className="text-2xl font-extrabold text-white">
                {formatCurrency(order.monthlyAmount)}
                <span className="text-xs font-normal text-slate-300">/mo</span>
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Device Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {order.product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.variant.storage} • {order.variant.colorName} • {order.product.brand}
                  </p>
                </div>
              </div>
              <Link
                href={`/products/${order.product.slug}`}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                View Product Details →
              </Link>
            </div>

            {/* Financial & Lien Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-3">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>Mutual Fund Portfolio Lien</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Folio Number:</span>
                  <strong className="font-mono text-slate-900">{order.folioNumber}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pledged Units:</span>
                  <strong className="text-slate-900">{order.mutualFundUnitsPledged} units</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Market Status:</span>
                  <strong className="text-emerald-700">Invested & Compounding</strong>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-2">
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-3">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>EMI Schedule & Tenure</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Total Tenure:</span>
                  <strong className="text-slate-900">{order.tenureMonths} Months</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Auto-Debit Date:</span>
                  <strong className="text-slate-900">5th of Every Month</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Interest Rate:</span>
                  <strong className="text-emerald-700">0% Interest Plan</strong>
                </div>
              </div>
            </div>

            {/* Applicant Details */}
            <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <span>
                Applicant: <strong className="text-slate-800">{order.customerName}</strong>
              </span>
              <span>
                Registered PAN: <strong className="font-mono text-slate-800">{order.panNumber.slice(0, 2)}******{order.panNumber.slice(-2)}</strong>
              </span>
              <span>
                Applied on: {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading order tracker...</div>}>
          <TrackContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
