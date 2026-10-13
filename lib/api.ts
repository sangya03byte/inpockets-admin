/**
 * Typed client skeleton for the admin -> FastAPI contract.
 *
 * STATUS: the endpoint paths below are PROPOSED from the product handbook and the mobile
 * app's /api/v1 convention. They have not been checked against the backend routers
 * (that repo's main branch is incomplete). Confirm each path, then replace the mock
 * imports in the pages with these calls.
 */

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(public status: number, message: string, public requestId?: string) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    credentials: "include", // httpOnly session cookie, never localStorage tokens
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail ?? res.statusText, res.headers.get("x-request-id") ?? undefined);
  }
  return res.json() as Promise<T>;
}

/** Every state-changing admin action carries a reason; the backend writes it to the audit log. */
const act = <T>(path: string, reason: string, extra: object = {}) =>
  request<T>(path, { method: "POST", body: JSON.stringify({ reason, ...extra }) });

export const adminApi = {
  auth: {
    login: (email: string, password: string) => request("/admin/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    verifyMfa: (code: string) => request("/admin/auth/mfa", { method: "POST", body: JSON.stringify({ code }) }),
    me: () => request("/admin/auth/me"),
  },
  applications: {
    list: (params = "") => request(`/admin/applications${params}`),
    get: (id: string) => request(`/admin/applications/${id}`),
    approve: (id: string, amount: number, reason: string) => act(`/admin/applications/${id}/approve`, reason, { amount }),
    reject: (id: string, reason: string) => act(`/admin/applications/${id}/reject`, reason),
    requestInfo: (id: string, reason: string) => act(`/admin/applications/${id}/request-info`, reason),
    escalate: (id: string, reason: string) => act(`/admin/applications/${id}/escalate`, reason),
  },
  kyc: {
    list: () => request("/admin/kyc"),
    resolve: (id: string, outcome: "VERIFIED" | "FAILED" | "RETRY", reason: string) => act(`/admin/kyc/${id}/resolve`, reason, { outcome }),
  },
  fraud: {
    list: () => request("/admin/fraud-cases"),
    resolve: (id: string, outcome: "CLEARED" | "ESCALATED" | "CONFIRMED", reason: string) => act(`/admin/fraud-cases/${id}/resolve`, reason, { outcome }),
  },
  disbursements: {
    list: () => request("/admin/disbursements"),
    // The backend, not the browser, owns the idempotency key (derived from the loan and attempt).
    release: (id: string, reason: string) => act(`/admin/disbursements/${id}/release`, reason),
    retry: (id: string, reason: string) => act(`/admin/disbursements/${id}/retry`, reason),
  },
  reconciliation: {
    list: () => request("/admin/reconciliation"),
    adjust: (id: string, reason: string) => act(`/admin/reconciliation/${id}/adjust`, reason),
  },
  policy: {
    list: () => request("/admin/policies"),
    approve: (id: string, reason: string) => act(`/admin/policies/${id}/approve`, reason),
  },
  audit: { list: (params = "") => request(`/admin/audit-events${params}`) },
};
