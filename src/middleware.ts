import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // return NextResponse.redirect(new URL('/home', request.url))
    const path = request.nextUrl.pathname
    const isPublicPath = path === '/login' || path === '/signup';

    const token = request.cookies.get('token')?.value || "";

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
        // return NextResponse.redirect('/dashboard');
        // return NextResponse.rewrite(new URL('/dashboard', request.url))
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
        // return NextResponse.redirect('/login');
        // return NextResponse.rewrite(new URL('/login', request.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/dashboard',
        '/login',
        '/signup',
    ]
}