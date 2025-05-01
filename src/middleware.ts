// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/signup' || path === '/';

  // NextAuth session token cookie (works both dev & prod)
  const token =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    '';

  if (path === '/home' && token) {
    return NextResponse.rewrite(new URL('/', request.nextUrl));
  }

  if (path === '/' && !token) {
    return;
  }

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/dashboard/profile',
    '/dashboard/history',
    '/dashboard/history/:path*',
    '/login',
    '/signup',
    '/home',
  ],
};
