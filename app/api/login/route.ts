import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get("username") || "";
    const password = searchParams.get("password") || "";

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const authedUser = await prisma.user.findUnique({
      where: {
        username: username,
        password: password,
      },
    });

    if (!authedUser) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const cookie = cookies();
    cookie.set("user", JSON.stringify(authedUser));

    return NextResponse.json(authedUser);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
