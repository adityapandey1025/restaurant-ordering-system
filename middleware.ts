import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    const role = request.nextauth.token?.role;
    const path = request.nextUrl.pathname;
    if (path.startsWith("/admin") && role !== "ADMIN") return NextResponse.redirect(new URL("/", request.url));
    if (path.startsWith("/staff") && !["STAFF", "ADMIN"].includes(String(role))) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  },
  { callbacks: { authorized: ({ token }) => Boolean(token) } },
);

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/orders/:path*", "/wallet/:path*", "/admin/((?!login).)*", "/staff/:path*"],
};
