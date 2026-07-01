import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js middleware runs server-side (edge runtime), so it CAN read the
 * `accessToken` HTTP-only cookie even though client-side JS cannot. This
 * gives us UX-level route protection: redirect unauthenticated users to
 * /login and wrong-role users away from routes that aren't theirs.
 *
 * This is NOT the source of truth for authorization — the backend's
 * auth.ts + rbac.ts middlewares are, and re-verify on every API call.
 * This layer only prevents flashing a protected page before redirecting.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/user');

  if (!token) {
    if (isAdminRoute || isUserRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Decode the JWT payload (no signature verification here — that's the
  // backend's job on every actual API request) just to read `role` for
  // routing purposes.
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

    if (isAuthRoute) {
      return NextResponse.redirect(new URL(payload.role === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard', request.url));
    }
    if (isAdminRoute && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }
    if (isUserRoute && payload.role !== 'USER' && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/admin/:path*', '/user/:path*'],
};
