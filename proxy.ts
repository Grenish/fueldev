import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthenticated = !!session;

  // Public auth pages that authenticated users shouldn't access
  const authPages = ["/auth/login", "/auth/signup", "/auth/otp"];
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  // Protected routes that require authentication
  const protectedRoutes = ["/home", "/(after-auth)"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Redirect authenticated users away from auth pages to /home
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Redirect unauthenticated users from protected routes to /auth/login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
