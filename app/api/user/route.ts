import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await prisma.user.findMany();
  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get("email") || "";
    const fullName = searchParams.get("fullName") || "";
    const password = searchParams.get("password") || "";
    const username = searchParams.get("username") || "";

    const newUser = await prisma.user.create({
      data: {
        email,
        fullName,
        password,
        username,
      },
    });
    return NextResponse.json(newUser);
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
    const email = searchParams.get("email") || "";
    const fullName = searchParams.get("fullName") || "";
    const password = searchParams.get("password") || "";
    const username = searchParams.get("username") || "";

    console.log("searchParams", searchParams);

    const newUser = await prisma.user.update({
      data: {
        email,
        fullName,
        password,
        username,
      },
      where: {
        username,
      },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get("username") || "";

    const newUser = await prisma.user.delete({
      where: {
        username,
      },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
