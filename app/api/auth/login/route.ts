import { NextResponse, type NextRequest } from "next/server";
import { BACKEND, CSRF_HEADER, CSRF_VALUE, applyTokens } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  if (req.headers.get(CSRF_HEADER) !== CSRF_VALUE) return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  const r = await fetch(`${BACKEND}/admin/auth/verify-otp`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(req.headers.get("x-forwarded-for") ? { "x-forwarded-for": req.headers.get("x-forwarded-for")! } : {}), "user-agent": req.headers.get("user-agent") ?? "" },
    body: await req.text(),
    cache: "no-store",
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    return NextResponse.json({ detail: data?.detail ?? "Sign-in failed" }, { status: r.status });
  }
  // Tokens go into httpOnly cookies and are NOT returned to the page.
  const res = NextResponse.json({
    role: data.role,
    mfa_enabled: data.mfa_enabled,
    mfa_enrollment_required: data.mfa_enrollment_required,
  });
  applyTokens(res, data);
  return res;
}
