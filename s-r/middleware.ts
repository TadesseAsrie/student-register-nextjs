
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

// ✅ Runtime set as a separate export
export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Allow login page and all API routes
  if (pathname === "/login" || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const payload = verifyToken(token);
    if (!payload) throw new Error("Invalid token");

    const isAdminRoute = pathname.startsWith("/dashboard/admin");
    const isStudentRoute = pathname.startsWith("/dashboard/student");

    if (isAdminRoute && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/student/profile", request.url));
    }
    if (isStudentRoute && payload.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/dashboard/admin/students", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};