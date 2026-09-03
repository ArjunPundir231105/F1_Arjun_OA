import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Product identifier is required" },
        { status: 400 }
      );
    }

    // Lookup either by slug or by id
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
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product from database" },
      { status: 500 }
    );
  }
}
