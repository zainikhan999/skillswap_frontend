import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('authToken'); // Get token from cookies

  if (token) {
    return NextResponse.next(); // Allow access if authenticated
  }

  // Redirect to login if not authenticated
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: [ '/main'], // Protect these routes
};