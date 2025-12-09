import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root to login
  if (pathname === "/") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Protect /dashboard route - check for auth cookie
  if (pathname.startsWith("/dashboard")) {
    const authCookie = request.cookies.get("auth");
    
    // If no auth cookie, redirect to login
    if (!authCookie || authCookie.value !== "true") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};

