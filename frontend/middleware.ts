import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Pathname: ${pathname}`); // Added log

  // Define protected routes (or patterns that should require authentication)
  const protectedRoutes = ['/dashboard', '/config-user', '/change-password'];

  // Define routes that should be accessible without authentication (public routes)
  const publicRoutes = ['/', '/forgot-password']; // Assuming '/' is the login page

  // Define API routes that don't require authentication (e.g., login, forgot-password, cookie setting)
  const publicApiRoutes = ['/api/auth/login', '/api/auth/forgot-password', '/api/auth/set-cookies'];

  // Get idToken from cookies
  const idToken = request.cookies.get('idToken')?.value;
  console.log(`[Middleware] idToken present: ${!!idToken}`); // Added log

  // Check if the current path is an API route that is public
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    console.log('[Middleware] Public API route, continuing...'); // Added log
    return NextResponse.next();
  }

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!idToken) {
      // If no idToken, redirect to login page
      console.log('[Middleware] Protected route without idToken, redirecting to /'); // Added log
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    console.log('[Middleware] Protected route with idToken, continuing...'); // Added log
  }

  // If the user is trying to access a public route (like login or forgot-password) and is already authenticated,
  // redirect them to a dashboard (or another appropriate authenticated page).
  const isPublicRoute = publicRoutes.includes(pathname);
  if (isPublicRoute && idToken) {
    console.log('[Middleware] Public route with idToken, redirecting to /config-user'); // Updated log
    const url = request.nextUrl.clone();
    url.pathname = '/config-user'; // Redirect to config-user if logged in
    return NextResponse.redirect(url);
  }

  console.log('[Middleware] No specific redirect, continuing...'); // Added log
  return NextResponse.next();
}

// Config to specify which paths the middleware should run on
export const config = {
  matcher: [
    '/', // login page
    '/dashboard/:path*', // Match /dashboard and any sub-paths
    '/config-user/:path*', // Match /config-user and any sub-paths
    '/change-password/:path*', // Match /change-password and any sub-paths
    '/forgot-password',
    '/api/auth/:path*', // All API routes related to auth
  ],
};