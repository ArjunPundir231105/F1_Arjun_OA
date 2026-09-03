import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get("brand");
    const search = searchParams.get("search");

    const whereClause: Record<string, unknown> = {};

    if (brand && brand !== "all") {
      whereClause.brand = {
        equals: brand,
      };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ];
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products from database",
      },
      { status: 500 }
    );
  }
}
