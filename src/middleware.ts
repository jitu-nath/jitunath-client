import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Get the token from cookies
  const token = request.cookies.get("accessToken")?.value;
  let user = null;
  console.log("Processing path:", pathname);
  console.log("Token present:", token ? "yes" : "no");

  // Check if token exists and decode it
  if (token) {
    try {
      // Replace this with your actual secret key
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET ||
          "JWT_ACCESS_SECRET_JWT_ACCESS_SECRET_JWT_ACCESS_SECRET"
      );
      const { payload } = await jwtVerify(token, secret);

      // If email exists in payload, consider user as authenticated
      if (payload && payload.email) {
        user = payload;
      }
      console.log(payload, "payload");
    } catch (error) {
      console.error("Token verification failed:", error);
      // Invalidate the bad token by not setting the user
      user = null;
    }
  }

  // Special admin access: user with specific email can access any route
  if (user && user.email === "kafikafi1922@gmail.com") {
    return NextResponse.next();
  }

  // If user is authenticated (has valid token with email)
  if (user) {
    // Redirect from auth pages if already logged in
    if (
      ["/login", "/signin", "forget-password", "reset-password"].includes(
        pathname
      )
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Regular authenticated users can access the home page
    if (pathname !== "/") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // If not authenticated, only allow access to login page
    if (
      pathname !== "/login" &&
      pathname !== "/signin" &&
      pathname !== "/forget-password" &&
      pathname !== "/reset-password"
    ) {
      console.log(`Redirecting unauthenticated user from ${pathname} to Login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
