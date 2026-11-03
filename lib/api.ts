// Browser-side client. It only talks to this app's own /api routes; the server attaches the
// session cookie and forwards to the backend. No tokens ever exist in page JavaScript.
export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown, public retryAfter?: number) {
    super(message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function messageFrom(body: any, fallback: string): string {
  if (typeof body?.detail === "string") return body.detail;
  if (Array.isArray(body?.detail)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return body.detail.map((d: any) => `${(d.loc ?? []).slice(1).join(".")}: ${d.msg}`.replace(/^: /, "")).join("; ");
  }
  if (typeof body?.error?.message === "string") return body.error.message;
  return fallback;
}

function toLogin() {
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    // The proxy sends signed-out visitors to /login (and keeps ?next=); the server already cleared the cookies.
    window.location.reload();
  }
}

async function send<T>(url: string, method: string, body?: unknown, redirectOn401 = true): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      credentials: "same-origin",
      headers: { "content-type": "application/json", "x-requested-with": "inpockets-admin" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Check that the backend is running.");
  }
  const text = await res.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* non-JSON error page */ }
  if (res.status === 401 && redirectOn401) toLogin();
  if (!res.ok) {
    throw new ApiError(res.status, messageFrom(data, `Request failed (${res.status})`), data, Number(res.headers.get("retry-after")) || undefined);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => send<T>(`/api/backend/${path}`, "GET"),
  post: <T>(path: string, body?: unknown) => send<T>(`/api/backend/${path}`, "POST", body ?? {}),
  patch: <T>(path: string, body: unknown) => send<T>(`/api/backend/${path}`, "PATCH", body),
};

export const auth = {
  requestOtp: (phone_number: string) => send<{ message: string }>("/api/auth/request-otp", "POST", { phone_number }, false),
  login: (body: { phone_number: string; otp: string; totp_code?: string }) =>
    send<{ role: string; mfa_enabled: boolean; mfa_enrollment_required: boolean }>("/api/auth/login", "POST", body, false),
  logout: () => send<{ message: string }>("/api/auth/logout", "POST", {}, false),
};
