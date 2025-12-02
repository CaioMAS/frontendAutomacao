import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes (or patterns that should require authentication)
  const protectedRoutes = ['/dashboard', '/config-user', '/change-password'];

  // Define routes that should be accessible without authentication (public routes)
  const publicRoutes = ['/', '/forgot-password']; // Assuming '/' is the login page

  // Define API routes that don't require authentication (e.g., login, forgot-password, cookie setting)
  const publicApiRoutes = ['/api/auth/login', '/api/auth/forgot-password', '/api/auth/set-cookies', '/api/auth/logout'];

  // Get idToken from cookies
  // Get idToken or session cookie
  const idToken = request.cookies.get('idToken')?.value || request.cookies.get('session')?.value;

  // Check if the current path is an API route that is public
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!idToken) {
      // If no idToken, redirect to login page
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // If the user is trying to access a public route (like login or forgot-password) and is already authenticated,
  // redirect them to a dashboard (or another appropriate authenticated page).
  const isPublicRoute = publicRoutes.includes(pathname);
  if (isPublicRoute && idToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/config-user'; // Redirect to config-user if logged in
    return NextResponse.redirect(url);
  }

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