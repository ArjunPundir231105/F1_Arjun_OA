"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles, TrendingUp, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> 1Fi Special
        </span>
        <span>Get gadgets on 0% Interest EMI backed by your Mutual Funds. Keep earning returns!</span>
        <Link href="#how-it-works" className="underline hover:text-indigo-200 inline-flex items-center text-[11px] ml-1">
          Learn how <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
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

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search iPhone 17 Pro, Samsung S24 Ultra, Pixel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-full py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          {/* Navigation Links & Badges */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors hidden sm:block"
            >
              All Products
            </Link>
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Compounding Returns Protected</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-indigo-800 font-semibold bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>CAMS & KFintech Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-header Categories */}
      <div className="bg-slate-50 border-t border-slate-200 text-xs py-2 px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-6 font-medium text-slate-600 whitespace-nowrap">
          <Link href="/" className="text-indigo-600 font-semibold hover:text-indigo-700">
            🔥 Featured Flagships
          </Link>
          <Link href="/products/iphone-17-pro" className="hover:text-indigo-600">
            Apple iPhone 17 Pro (New)
          </Link>
          <Link href="/products/samsung-s24-ultra" className="hover:text-indigo-600">
            Samsung Galaxy S24 Ultra
          </Link>
          <Link href="/products/google-pixel-9-pro" className="hover:text-indigo-600">
            Google Pixel 9 Pro
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
