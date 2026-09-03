import React from "react";
import Link from "next/link";
import { ShieldCheck, TrendingUp, CheckCircle, RefreshCw } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      {/* 1Fi Unique Value Proposition */}
      <div className="border-b border-slate-800 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-1">Your Investments Keep Growing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlike traditional EMIs or liquidating savings, your mutual funds stay invested in the market and compound at 12-14% CAGR while you pay your monthly EMI.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-1">True 0% Interest Plans</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose between 3, 6, 12, or 24 months with 0% interest and receive instant cashback credited directly to your bank account or folio.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base mb-1">Bank-Grade Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pledge securely via SEBI-registered RTAs (CAMS & KFintech). Units are lien-marked only — they never leave your Demat/Folio account.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              ↑1Fi
            </div>
            <span className="font-bold text-white tracking-tight">1Fi Financial</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Smart consumer electronics powered by asset-backed credit and mutual fund collateralization.
          </p>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Products</h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/products/iphone-17-pro" className="hover:text-indigo-400 transition-colors">Apple iPhone 17 Pro</Link></li>
            <li><Link href="/products/samsung-s24-ultra" className="hover:text-indigo-400 transition-colors">Samsung S24 Ultra</Link></li>
            <li><Link href="/products/google-pixel-9-pro" className="hover:text-indigo-400 transition-colors">Google Pixel 9 Pro</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Backend APIs</h5>
          <ul className="space-y-2 text-xs">
            <li><code className="text-indigo-400">GET /api/products</code></li>
            <li><code className="text-indigo-400">GET /api/products/:slug</code></li>
            <li><code className="text-indigo-400">POST /api/orders</code></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Compliance & Security</h5>
          <p className="text-xs text-slate-400">
            Backed by SEBI registered mutual fund trusts. ISO 27001 certified data pipelines.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Real-time CAMS & KFintech API Sync</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} 1Fi Technologies. Built for 1Fi SDE1 Assessment. All rights reserved.
      </div>
    </footer>
  );
}
