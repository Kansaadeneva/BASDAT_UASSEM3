import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get("username") || "";
  let product;
  if (username) {
    product = await prisma.product.findMany({
      where: {
        username,
      },
    });
  } else {
    product = await prisma.product.findMany();
  }
  return NextResponse.json(product);
}

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const name = searchParams.get("name") || "";
    const description = searchParams.get("description") || "";
    const price = searchParams.get("price") || "";
    const username = searchParams.get("username") || "";
    const imageUrl = searchParams.get("imageUrl") || "";

    console.log(imageUrl);

    const priceFloat = parseFloat(price);

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: priceFloat,
        username,
        imageUrl,
      },
    });
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "";
    const name = searchParams.get("name") || "";
    const description = searchParams.get("description") || "";
    const price = searchParams.get("price") || "";
    const username = searchParams.get("username") || "";

    const priceFloat = parseFloat(price);

    const newProduct = await prisma.product.update({
      data: {
        name,
        description,
        price: priceFloat,
        username,
      },
      where: {
        id,
      },
    });
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id") || "";

    const newProduct = await prisma.product.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
