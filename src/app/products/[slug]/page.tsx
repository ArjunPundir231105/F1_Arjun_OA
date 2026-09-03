import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailClient from "@/components/ProductDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug: slug }, { id: slug }],
    },
  });

  if (!product) {
    return {
      title: "Product Not Found | 1Fi",
    };
  }

  return {
    title: `${product.name} on EMI | 0% Interest Mutual Fund Backed - 1Fi`,
    description: `Get ${product.name} on easy EMI plans backed by your mutual fund portfolio. 0% interest, no paperwork, instant lien marking with 1Fi.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Retrieve dynamic product data from database via Prisma
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug: slug }, { id: slug }],
    },
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
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Navbar />
      <main className="flex-1 pb-16">
        <ProductDetailClient product={product as any} />
      </main>
      <Footer />
    </div>
  );
}
