import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login' || path === '/signup' || path === '/';

  const token = request.cookies.get('token')?.value || '';

  // Rewrite /home to / if token is present
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
