import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, BACKEND, CSRF_HEADER, CSRF_VALUE, clearTokens } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  if (req.headers.get(CSRF_HEADER) !== CSRF_VALUE) return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  if (access) {
    await fetch(`${BACKEND}/admin/auth/logout`, { method: "POST", headers: { authorization: `Bearer ${access}` }, cache: "no-store" }).catch(() => undefined);
  }
  const res = NextResponse.json({ message: "Signed out" });
  clearTokens(res);
  return res;
}
