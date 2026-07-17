import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

/**
 * Next.js middleware for route protection.
 *
 * - Public routes (login, register, forgot-password, API auth) are accessible without auth.
 * - All other routes require an active session.
 * - Authenticated users accessing auth pages are redirected to the dashboard.
 */

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
const authApiPrefix = '/api/auth';

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const pathname = nextUrl.pathname;

  // Allow Auth.js API routes
  if (pathname.startsWith(authApiPrefix)) {
    return NextResponse.next();
  }

  // Allow public static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
