import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);
    const result = await authenticateUser(
      validated.username,
      validated.password,
    );
    if (!result) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const response = NextResponse.json(
      {
        user: {
          id: result.user.id,
          username: result.user.username,
          role: result.user.role,
        },
      },
      { status: 200 },
    );
    response.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.errors || error.message || "Login failed" },
      { status: 400 },
    );
  }
}
