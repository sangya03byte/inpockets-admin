import { NextResponse, type NextRequest } from "next/server";
import { BACKEND, CSRF_HEADER, CSRF_VALUE } from "@/lib/server/auth";

// Always answers 200 with the same body (the backend does too): no staff-number discovery.
export async function POST(req: NextRequest) {
  if (req.headers.get(CSRF_HEADER) !== CSRF_VALUE) return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  const body = await req.text();
  const r = await fetch(`${BACKEND}/admin/auth/request-otp`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(req.headers.get("x-forwarded-for") ? { "x-forwarded-for": req.headers.get("x-forwarded-for")! } : {}) },
    body,
    cache: "no-store",
  });
  const text = await r.text();
  return new NextResponse(text, { status: r.status, headers: { "content-type": "application/json", ...(r.headers.get("retry-after") ? { "retry-after": r.headers.get("retry-after")! } : {}) } });
}
