"use client";

import React, { useState } from "react";
import { Product, Variant, EmiPlan } from "@/types";
import { formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  X,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Loader2,
  AlertCircle,
  FileCheck,
  Lock,
  Printer,
  ExternalLink,
} from "lucide-react";

interface ProceedModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedVariant: Variant;
  selectedPlan: EmiPlan;
  monthlyAmount: number;
}

export default function ProceedModal({
  isOpen,
  onClose,
  product,
  selectedVariant,
  selectedPlan,
  monthlyAmount,
}: ProceedModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Form, 2: Verification, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "Aditya Sharma",
    email: "aditya.sharma@example.com",
    phone: "9876543210",
    pan: "ABCDE1234F",
  });

  // Confirmed Order Data
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic PAN check
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    if (!panRegex.test(formData.pan.trim())) {
      setError("Please enter a valid 10-character PAN number (e.g., ABCDE1234F)");
      return;
    }

    setLoading(true);
    setStep(2); // Show CAMS/KFintech verification simulation

    try {
      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          panNumber: formData.pan,
          productId: product.id,
          variantId: selectedVariant.id,
          emiPlanId: selectedPlan.id,
          tenureMonths: selectedPlan.tenureMonths,
          monthlyAmount: monthlyAmount,
          totalAmount: monthlyAmount * selectedPlan.tenureMonths,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process application");
      }

      setConfirmedOrder(data.data);
      setStep(3);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Fallback if confetti fails
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setError(null);
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 relative">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold">
              EMI Application
            </span>
            <span className="flex items-center gap-1 text-emerald-300 text-xs font-medium">
              <Lock className="w-3 h-3" /> Secure Verification
            </span>
          </div>
          <h3 className="text-xl font-bold">
            {step === 3 ? "Application Approved" : "Pledge Mutual Funds & Proceed"}
          </h3>
          <p className="text-xs text-indigo-100 mt-1">
            Instant electronic lien verification via CAMS & KFintech.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Plan Summary Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedVariant.colorName} • {selectedVariant.storage}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-600 block">Total Price</span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatCurrency(selectedVariant.price)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-[11px] text-slate-600 block">Monthly EMI</span>
                <span className="font-bold text-indigo-600 text-sm">
                  {formatCurrency(monthlyAmount)}/mo
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-[11px] text-slate-600 block">Tenure</span>
                <span className="font-bold text-slate-800 text-sm">
                  {selectedPlan.tenureMonths} Months
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-[11px] text-slate-600 block">Interest Rate</span>
                <span className={`font-bold text-sm ${selectedPlan.isZeroInterest ? "text-emerald-600" : "text-slate-800"}`}>
                  {selectedPlan.interestRate}% {selectedPlan.isZeroInterest && "No Cost"}
                </span>
              </div>
            </div>

            {selectedPlan.cashbackAmount > 0 && (
              <div className="mt-3 flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md font-medium">
                <span>🎁 Special Cashback applied:</span>
                <span className="font-bold">{formatCurrency(selectedPlan.cashbackAmount)}</span>
              </div>
            )}
          </div>

          {/* Step 1: Details Form */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name (as per PAN)
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                  placeholder="e.g. Aditya Sharma"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                    placeholder="aditya@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PAN Card Number (for Mutual Fund Verification)
                </label>
                <input
                  type="text"
                  name="pan"
                  required
                  maxLength={10}
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  className="w-full text-sm font-mono uppercase tracking-wider border border-slate-300 rounded-lg px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
                  placeholder="ABCDE1234F"
                />
                <span className="text-[11px] text-slate-600 mt-1 block">
                  We use PAN to safely read eligible mutual fund units via CAMS & KFintech without withdrawing them.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Verify Portfolio & Proceed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Verification Loading Animation */}
          {step === 2 && (
            <div className="py-10 text-center space-y-4">
              <div className="relative inline-block">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-800" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Verifying Mutual Fund Holdings</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Connecting to CAMS and KFintech registries with PAN {formData.pan}...
                </p>
              </div>
              <div className="max-w-xs mx-auto bg-slate-100 rounded-lg p-3 text-left text-xs text-slate-600 space-y-1.5 border border-slate-200">
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PAN Verified & Active
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Eligible Portfolio: ₹3,25,000 Detected
                </div>
                <div className="flex items-center gap-2 text-indigo-700 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Marking Lien for {formatCurrency(selectedVariant.price)}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Success Confirmation */}
          {step === 3 && confirmedOrder && (
            <div className="space-y-4">
              <div className="text-center py-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Application & Lien Approved!</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your mutual fund units are pledged. Your device order is placed!
                </p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Order ID:</span>
                  <span className="font-mono font-bold text-slate-900">{confirmedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Mutual Fund Folio Lien:</span>
                  <span className="font-mono font-bold text-indigo-700">{confirmedOrder.folioNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pledged Units:</span>
                  <span className="font-semibold text-slate-900">{confirmedOrder.mutualFundUnitsPledged} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">First Auto-Debit EMI:</span>
                  <span className="font-bold text-indigo-700">
                    {formatCurrency(confirmedOrder.monthlyAmount)} (on 5th of next month)
                  </span>
                </div>
                <div className="flex justify-between border-t border-emerald-200/60 pt-2 text-[11px] text-slate-500">
                  <span>Applicant PAN:</span>
                  <span className="font-mono">{formData.pan ? formData.pan.slice(0, 2) + "******" + formData.pan.slice(-2).toUpperCase() : "ABCDE1234F"}</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-indigo-600 shrink-0" />
                <p className="text-[11px] text-indigo-900 leading-snug">
                  Your mutual fund units remain in your folio and continue to earn market returns during the tenure.
                </p>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Receipt</span>
                </button>
                <a
                  href={`/track?id=${confirmedOrder.id}`}
                  className="flex-1 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-semibold py-2.5 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Track Order</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                Done & Return to Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
