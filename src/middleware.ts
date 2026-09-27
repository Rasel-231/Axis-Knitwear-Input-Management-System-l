import { NextRequest, NextResponse } from 'next/server';
import { ROLE_META, isRole } from './core/lib/roleMeta';
import { Role } from './types';

/**
 * Next.js middleware runs server-side (edge runtime), so it CAN read the
 * `accessToken` HTTP-only cookie even though client-side JS cannot. This
 * gives us UX-level route protection: redirect unauthenticated users to
 * /login and stop anyone from opening a workspace that is not theirs.
 *
 * This is NOT the source of truth for authorization — the backend's
 * auth.ts + rbac.ts middlewares are, and re-verify on every API call.
 * This layer only prevents flashing a protected page before redirecting.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isPrintRoute = pathname.includes('/print/');
  const [segment] = pathname.split('/').filter(Boolean);

  if (!token) {
    if (segment) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
  }

  // Decode the JWT payload (no signature verification here — that's the
  // backend's job on every actual API request) just to read `role` for
  // routing purposes.
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const role = payload.role as Role;

    if (isAuthRoute) {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, request.url));
    }

    if (!isRole(segment)) {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, request.url));
    }

    if (role !== segment.toUpperCase()) {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, request.url));
    }

    if (isPrintRoute && !ROLE_META[role]?.canAccessPrint) {
      return NextResponse.redirect(new URL(`/${role.toLowerCase()}/dashboard`, request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/:role(.*)'],
};
