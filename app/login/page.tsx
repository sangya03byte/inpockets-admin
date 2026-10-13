"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button, inputClass } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your work email and password.");
      return;
    }
    setLoading(true);
    // Placeholder until the admin auth endpoint exists (see docs/INTEGRATION.md).
    setTimeout(() => {
      setLoading(false);
      setError("Sign-in is not connected to the backend yet. Use the sandbox link below to explore.");
    }, 700);
  }

  return (
    <div className="grid h-screen min-w-[1200px] grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
      <section className="flex flex-col justify-between bg-brand-900 p-14 text-white">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-500 font-display text-lg font-bold">I</span>
          <span className="font-display text-lg font-semibold">InPockets</span>
        </div>
        <div className="max-w-md">
          <h1 className="font-display text-4xl font-semibold leading-tight text-white">Every approval, with the reasons attached.</h1>
          <p className="mt-4 text-base text-brand-200">
            Review applications, release payouts and follow every repayment from one console. Each action is recorded with who did it and why.
          </p>
        </div>
        <p className="text-xs text-brand-300">Authorised staff only. Access is logged.</p>
      </section>

      <section className="flex items-center justify-center bg-surface p-14">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5" noValidate>
          <div>
            <h2 className="text-2xl font-semibold">Sign in</h2>
            <p className="mt-1 text-sm text-muted">Use your InPockets work account.</p>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Work email</span>
            <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@inpockets.in" className={inputClass} />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Password</span>
            <span className="relative block">
              <input
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50"
              >
                {show ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          {error && (
            <p role="alert" className="rounded-lg bg-bad-soft px-3.5 py-2.5 text-sm text-bad">
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={loading} className="h-10 w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-center text-sm text-muted">
            <Link href="/dashboard" className="font-medium text-brand-700 hover:underline">
              Continue with sandbox data
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}
