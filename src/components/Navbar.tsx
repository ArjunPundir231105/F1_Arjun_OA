"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles, TrendingUp, ShieldCheck, ArrowUpRight, X, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  brand: string;
  basePrice: number;
  variants: Array<{
    images: Array<{ url: string; alt: string }>;
  }>;
  emiPlans: Array<{
    monthlyAmount: number;
    tenureMonths: number;
  }>;
}

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchTerm.trim())}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setResults(data.data.slice(0, 5));
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> 1Fi Special
        </span>
        <span>Get gadgets on 0% Interest EMI backed by your Mutual Funds. Keep earning returns!</span>
        <Link href="#how-it-works" className="underline hover:text-indigo-200 inline-flex items-center text-[11px] ml-1">
          Learn how <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="tracking-tighter">↑1Fi</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900">
                1Fi <span className="text-indigo-600 text-sm font-semibold">Store</span>
              </span>
              <span className="text-[10px] text-slate-600 -mt-1 font-medium tracking-wide">
                MUTUAL FUND BACKED EMIs
              </span>
            </div>
          </Link>

          <div ref={searchContainerRef} className="flex-1 max-w-lg hidden md:block relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search iPhone, Galaxy, Pixel, OnePlus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    if (results.length > 0) setIsOpen(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-full py-2 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setResults([]);
                      setIsOpen(false);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {isOpen && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold px-3 uppercase tracking-wider">
                  <span>Matching Gadgets</span>
                  <span>{results.length} found</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {results.map((item) => {
                    const img = item.variants?.[0]?.images?.[0]?.url || "";
                    const minEmi = item.emiPlans?.[0]?.monthlyAmount;
                    return (
                      <Link
                        key={item.id}
                        href={`/products/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center p-1 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {img ? (
                            <img src={img} alt={item.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <Search className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {item.brand} • Starts at {formatCurrency(item.basePrice)}
                          </p>
                        </div>
                        {minEmi && (
                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-slate-400 block">EMI from</span>
                            <span className="text-xs font-bold text-emerald-600">
                              {formatCurrency(minEmi)}/mo
                            </span>
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    );
                  })}
                </div>
                <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={handleSearch}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    View all results for &ldquo;{searchTerm}&rdquo;
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors hidden sm:block"
            >
              Catalog
            </Link>
            <Link
              href="/track"
              className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5"
            >
              <span>Track Order</span>
            </Link>
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Returns Protected</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs text-indigo-800 font-semibold bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>CAMS & KFintech</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 text-xs py-2 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-6 font-medium text-slate-600 whitespace-nowrap">
          <Link href="/" className="text-indigo-600 font-semibold hover:text-indigo-700">
            🔥 Featured Flagships
          </Link>
          <Link href="/products/iphone-17-pro" className="hover:text-indigo-600">
            Apple iPhone 17 Pro
          </Link>
          <Link href="/products/samsung-s24-ultra" className="hover:text-indigo-600">
            Samsung Galaxy S24 Ultra
          </Link>
          <Link href="/products/samsung-galaxy-z-fold-6" className="hover:text-indigo-600">
            Galaxy Z Fold 6
          </Link>
          <Link href="/products/oneplus-12" className="hover:text-indigo-600">
            OnePlus 12 5G
          </Link>
          <Link href="/products/google-pixel-9-pro" className="hover:text-indigo-600">
            Pixel 9 Pro
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-800 font-semibold">
            ✓ 0% Interest on 3 to 24 Months Tenures
          </span>
        </div>
      </div>
    </header>
  );
}
