// Server-only helpers: the browser never sees the access or refresh token.
// They live in httpOnly, SameSite=Strict cookies and are attached by the proxy route.
import type { NextResponse } from "next/server";

export const BACKEND = (process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");
export const ACCESS_COOKIE = "ip_at";
export const REFRESH_COOKIE = "ip_rt";
export const CSRF_HEADER = "x-requested-with";
export const CSRF_VALUE = "inpockets-admin";

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  refresh_token_expires_at: string;
};

function cookieBase() {
  // Secure cookies need https; set ADMIN_COOKIE_SECURE=false only for plain-http LAN testing.
  const secure = (process.env.ADMIN_COOKIE_SECURE ?? (process.env.NODE_ENV === "production" ? "true" : "false")) === "true";
  return { httpOnly: true, sameSite: "strict" as const, path: "/", secure };
}

export function applyTokens(res: NextResponse, t: TokenPair): void {
  const maxAge = Math.max(60, Math.floor((new Date(t.refresh_token_expires_at).getTime() - Date.now()) / 1000));
  res.cookies.set(ACCESS_COOKIE, t.access_token, { ...cookieBase(), maxAge });
  res.cookies.set(REFRESH_COOKIE, t.refresh_token, { ...cookieBase(), maxAge });
}

export function clearTokens(res: NextResponse): void {
  res.cookies.set(ACCESS_COOKIE, "", { ...cookieBase(), maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { ...cookieBase(), maxAge: 0 });
}

// Several requests can hit a 401 at the same moment; they must share ONE refresh,
// otherwise the second call would be treated as token reuse by the backend.
const inflight = new Map<string, Promise<TokenPair | null>>();

export function refreshTokens(refreshToken: string, forwardedFor?: string | null): Promise<TokenPair | null> {
  const existing = inflight.get(refreshToken);
  if (existing) return existing;
  const p = (async () => {
    try {
      const r = await fetch(`${BACKEND}/admin/auth/refresh`, {
        method: "POST",
        headers: { "content-type": "application/json", ...(forwardedFor ? { "x-forwarded-for": forwardedFor } : {}) },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
      });
      if (!r.ok) return null;
      return (await r.json()) as TokenPair;
    } catch {
      return null;
    } finally {
      setTimeout(() => inflight.delete(refreshToken), 5000);
    }
  })();
  inflight.set(refreshToken, p);
  return p;
}
