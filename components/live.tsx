"use client";
import { useCallback, useState } from "react";
import { ApiError } from "@/lib/api";
import { inr } from "@/lib/format";
import { Notice } from "./ui";

export const money = (s: string | null | undefined) => (s == null ? "—" : inr(Number(s)));

export function ErrorNote({ error }: { error: ApiError | string | null | undefined }) {
  if (!error) return null;
  const text = typeof error === "string" ? error : error.message;
  return <Notice tone="bad">{text}</Notice>;
}

export function Loading({ what = "data" }: { what?: string }) {
  return <p className="py-10 text-center text-sm text-muted">Loading {what}…</p>;
}

/** Runs a mutation with busy / error state; calls `then` (e.g. reload) on success. */
export function useAction(then?: () => void) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = useCallback(async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      then?.();
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong");
      return false;
    } finally {
      setBusy(false);
    }
  }, [then]);
  return { busy, error, run, clear: () => setError(null) };
}

export const PAGE_SIZE = 25;
