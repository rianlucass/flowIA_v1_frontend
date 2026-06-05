import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'flowia-token';

const CANDIDATE_APPLY_PATH = /^\/vagas\/[^/]+\/candidatar/;

function isProtectedPage(pathname: string): boolean {
  if (pathname.startsWith('/dashboard')) return true;
  if (pathname.startsWith('/vagas')) {
    if (CANDIDATE_APPLY_PATH.test(pathname)) return false;
    return true;
  }
  return false;
}

function isAuthPage(pathname: string): boolean {
  return pathname === '/login' || pathname === '/register';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  // ── Token injection for API proxy routes ──
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    if (token) {
      const headers = new Headers(request.headers);
      headers.set('Authorization', `Bearer ${token}`);
      return NextResponse.next({ request: { headers } });
    }
    return NextResponse.next();
  }

  // ── Redirect unauthenticated users from protected pages ──
  if (isProtectedPage(pathname) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect authenticated users away from auth pages ──
  if (token && isAuthPage(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ── Prevent browser caching of authenticated pages ──
  if (isProtectedPage(pathname)) {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    res.headers.set('Pragma', 'no-cache');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png).*)'],
};
