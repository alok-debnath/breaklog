// src/middleware.ts

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup" || path === "/";

  // BetterAuth session token
  const token =
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value ||
    "";

  if (path === "/home" && token) {
    return NextResponse.rewrite(new URL("/", request.nextUrl));
  }

  if (path === "/" && !token) {
    return;
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/history",
    "/dashboard/history/:path*",
    "/login",
    "/signup",
    "/home",
  ],
};
