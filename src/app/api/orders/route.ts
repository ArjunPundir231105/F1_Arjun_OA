import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      panNumber,
      productId,
      variantId,
      emiPlanId,
      tenureMonths,
      monthlyAmount,
      totalAmount,
    } = body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !panNumber ||
      !productId ||
      !variantId ||
      !emiPlanId
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "All applicant and plan details are required",
        },
        { status: 400 }
      );
    }

    // Verify product and variant exist
    const product = await prisma.product.findUnique({ where: { id: productId } });
    const variant = await prisma.variant.findUnique({ where: { id: variantId } });

    if (!product || !variant) {
      return NextResponse.json(
        { success: false, error: "Invalid product or variant" },
        { status: 404 }
      );
    }

    // Generate simulated Folio & Mutual Fund Units
    const simulatedFolio = `1FI-${Math.floor(100000 + Math.random() * 900000)}`;
    const simulatedUnits = Number((variant.price / 45.2).toFixed(3)); // e.g. approx NAV ₹45.2

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        panNumber: panNumber.toUpperCase(),
        productId,
        variantId,
        emiPlanId,
        tenureMonths: Number(tenureMonths),
        monthlyAmount: Number(monthlyAmount),
        totalAmount: Number(totalAmount),
        status: "APPROVED",
        folioNumber: simulatedFolio,
        mutualFundUnitsPledged: simulatedUnits,
      },
      include: {
        product: true,
        variant: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mutual Fund Pledged & EMI Plan Approved Successfully!",
      data: order,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process application order",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const query = searchParams.get("query");

    if (!id && !query) {
      return NextResponse.json(
        { success: false, error: "Please provide an Order ID, Folio Number, or PAN" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: id
        ? { id }
        : {
            OR: [
              { id: query || undefined },
              { folioNumber: query || undefined },
              { panNumber: query ? query.trim().toUpperCase() : undefined },
            ],
          },
      include: {
        product: true,
        variant: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "No matching application or order found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Order lookup failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to query order details" },
      { status: 500 }
    );
  }
}

