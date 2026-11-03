import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE, BACKEND, CSRF_HEADER, CSRF_VALUE, REFRESH_COOKIE, applyTokens, clearTokens, refreshTokens,
} from "@/lib/server/auth";

// Authenticated pass-through to the backend ADMIN API only.
//  * only paths under admin/ are reachable (customer endpoints are not exposed here)
//  * login / OTP / refresh are handled by /api/auth/*, never through this proxy
//  * state-changing calls need the CSRF header (cookies are also SameSite=Strict)
//  * a 401 triggers exactly one (shared) token refresh and a retry
const SEGMENT = /^[A-Za-z0-9_.-]+$/;
const BLOCKED = /^admin\/auth\/(request-otp|verify-otp|refresh)$/;

async function handle(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  if (!path.every((s) => SEGMENT.test(s) && s !== "." && s !== "..")) {
    return NextResponse.json({ detail: "Bad path" }, { status: 400 });
  }
  const target = path.join("/");
  if (!target.startsWith("admin/") || BLOCKED.test(target)) {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }
  const method = req.method;
  const mutating = method !== "GET" && method !== "HEAD";
  if (mutating && req.headers.get(CSRF_HEADER) !== CSRF_VALUE) {
    return NextResponse.json({ detail: "Forbidden" }, { status: 403 });
  }

  let access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;
  if (!access && !refresh) return NextResponse.json({ detail: "Not signed in" }, { status: 401 });

  const body = mutating ? await req.text() : undefined;
  const forwardedFor = req.headers.get("x-forwarded-for");
  const send = (token: string | undefined) =>
    fetch(`${BACKEND}/${target}${req.nextUrl.search}`, {
      method,
      headers: {
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(body ? { "content-type": req.headers.get("content-type") ?? "application/json" } : {}),
        "x-request-id": crypto.randomUUID(),
        ...(forwardedFor ? { "x-forwarded-for": forwardedFor } : {}),
      },
      body,
      cache: "no-store",
    });

  let upstream = await send(access);
  let renewed = null as Awaited<ReturnType<typeof refreshTokens>>;
  if (upstream.status === 401 && refresh) {
    renewed = await refreshTokens(refresh, forwardedFor);
    if (!renewed) {
      const res = NextResponse.json({ detail: "Session expired" }, { status: 401 });
      clearTokens(res);
      return res;
    }
    access = renewed.access_token;
    upstream = await send(access);
  }

  const headers = new Headers({ "content-type": upstream.headers.get("content-type") ?? "application/json" });
  const retryAfter = upstream.headers.get("retry-after");
  if (retryAfter) headers.set("retry-after", retryAfter);
  const res = new NextResponse(upstream.status === 204 ? null : await upstream.text(), { status: upstream.status, headers });
  if (renewed) applyTokens(res, renewed);
  return res;
}

export { handle as GET, handle as POST, handle as PATCH, handle as PUT, handle as DELETE };
