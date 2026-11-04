import { NextResponse, type NextRequest } from "next/server";

// Route guard: every page and every /api/backend call needs a session cookie.
// This is only a fast gate; the backend validates the token on every request.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const signedIn = req.cookies.has("ip_rt");

  if (pathname.startsWith("/api/backend/")) {
    return signedIn ? NextResponse.next() : NextResponse.json({ detail: "Not signed in" }, { status: 401 });
  }
  if (pathname === "/login") return NextResponse.next();
  if (!signedIn) {
    const url = new URL("/login", req.url);
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|ico|webp)$).*)"],
};
