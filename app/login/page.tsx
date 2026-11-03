"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError, auth } from "@/lib/api";
import { Button, Field, Notice, inputClass } from "@/components/ui";

type Step = "phone" | "code";

function SignIn() {
  const params = useSearchParams();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [totp, setTotp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = params.get("next");
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  async function requestOtp(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await auth.requestOtp(phone.trim());
      setStep("code");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally { setBusy(false); }
  }

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const r = await auth.login({ phone_number: phone.trim(), otp: otp.trim(), ...(totp.trim() ? { totp_code: totp.trim() } : {}) });
      window.location.assign(r.mfa_enrollment_required ? "/account" : safeNext);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-[400px] rounded-2xl bg-surface p-8 shadow-card ring-1 ring-line">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-600 font-display text-lg font-bold text-white">I</span>
          <div>
            <h1 className="font-display text-lg font-semibold text-ink">InPockets staff sign-in</h1>
            <p className="text-xs text-muted">Operations console</p>
          </div>
        </div>

        {error && <div className="mb-4"><Notice tone="bad">{error}</Notice></div>}

        {step === "phone" ? (
          <form onSubmit={requestOtp} className="space-y-4">
            <Field label="Mobile number" hint="The number registered for your staff account.">
              <input className={inputClass} inputMode="numeric" autoComplete="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile number" required />
            </Field>
            <Button variant="primary" type="submit" disabled={busy || phone.length !== 10}>{busy ? "Sending…" : "Send code"}</Button>
          </form>
        ) : (
          <form onSubmit={signIn} className="space-y-4">
            <Notice tone="brand">If this number belongs to an active staff account, a code was sent to ******{phone.slice(-4)}.</Notice>
            <Field label="SMS code">
              <input className={inputClass} inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="6-digit code" required autoFocus />
            </Field>
            <Field label="Authenticator code" hint="Only if you have set up MFA.">
              <input className={inputClass} inputMode="numeric" maxLength={6} value={totp} onChange={(e) => setTotp(e.target.value.replace(/\D/g, ""))} placeholder="6-digit code (optional)" />
            </Field>
            <div className="flex items-center gap-3">
              <Button variant="primary" type="submit" disabled={busy || otp.length !== 6}>{busy ? "Signing in…" : "Sign in"}</Button>
              <button type="button" className="text-sm text-muted hover:text-ink" onClick={() => { setStep("phone"); setOtp(""); setTotp(""); setError(null); }}>Use a different number</button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><SignIn /></Suspense>;
}
