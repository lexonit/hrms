import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Route Protection
 * Handles authentication and authorization for public/private routes
 */

// Define public routes that don't require authentication
const publicRoutes = ['/'];

// Define private routes that require authentication
const privateRoutes = [
  '/dashboard',
  '/employees',
  '/projects',
  '/tasks',
  '/attendance',
  '/leaves',
  '/timesheets',
  '/payroll',
  '/kb',
  '/settings',
  '/onboarding',
];

// Define role-based route restrictions (optional)
const roleRestrictedRoutes: Record<string, string[]> = {
  '/employees': ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'],
  '/settings': ['SUPER_ADMIN', 'HR_ADMIN'],
  '/onboarding': ['SUPER_ADMIN', 'HR_ADMIN'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authentication state from cookie
  const authCookie = request.cookies.get('auth-storage');
  let isAuthenticated = false;
  let userRole: string | null = null;

  // Parse authentication from cookie if exists
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie.value);
      isAuthenticated = !!authData.state?.currentUser;
      userRole = authData.state?.currentUser?.role || null;
    } catch (error) {
      // Invalid cookie format, treat as unauthenticated
      isAuthenticated = false;
    }
  }

  // Check if route is private
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname);

  // Redirect unauthenticated users from private routes to login
  if (isPrivateRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('redirect', pathname); // Save intended destination
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from login page to dashboard
  if (isPublicRoute && isAuthenticated && pathname === '/') {
    const redirect = request.nextUrl.searchParams.get('redirect');
    const url = request.nextUrl.clone();
    url.pathname = redirect && privateRoutes.includes(redirect) ? redirect : '/dashboard';
    url.searchParams.delete('redirect');
    return NextResponse.redirect(url);
  }

  // Check role-based access restrictions
  if (isAuthenticated && userRole) {
    const restrictedRoles = roleRestrictedRoutes[pathname];
    if (restrictedRoles && !restrictedRoles.includes(userRole)) {
      // User doesn't have required role, redirect to dashboard
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Add security headers
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Add authentication state to response headers for client-side access
  if (isAuthenticated) {
    response.headers.set('X-User-Authenticated', 'true');
  }

  return response;
}

// Configure which routes should trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
