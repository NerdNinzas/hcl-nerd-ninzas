import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Check if user is trying to access provider routes
    if (pathname.startsWith('/provider')) {
      if (token?.role !== 'provider' && token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Check if user is trying to access admin routes
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/auth/') && token) {
      if (token.role === 'provider') {
        return NextResponse.redirect(new URL('/provider', req.url));
      } else if (token.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Allow access to public routes
        if (pathname.startsWith('/auth/') || pathname === '/' || pathname === '/health-info' || pathname.startsWith('/api/auth/')) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/provider/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
    '/api/user/:path*',
    '/api/goals/:path*',
    '/api/appointments/:path*',
    '/api/patients/:path*',
    '/api/providers/:path*'
  ]
};