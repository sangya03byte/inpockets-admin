"use client";
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "./api";
import type { Me } from "./types";
import { useApi } from "./use-api";

type Ctx = { me: Me | null; loading: boolean; can: (permission: string) => boolean; signOut: () => Promise<void> };
const SessionContext = createContext<Ctx>({ me: null, loading: true, can: () => false, signOut: async () => undefined });

export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: me, loading, error } = useApi<Me>("admin/auth/me");

  // Staff who still have to enrol a second factor can only reach /account.
  useEffect(() => {
    if (me?.mfa_enrollment_required && !pathname.startsWith("/account")) router.replace("/account");
  }, [me, pathname, router]);

  const value = useMemo<Ctx>(() => ({
    me,
    loading,
    can: (p) => !!me && me.permissions.includes(p),
    signOut: async () => {
      try { await auth.logout(); } finally { router.replace("/login"); router.refresh(); }
    },
  }), [me, loading, router]);

  if (error && error.status !== 401) {
    return <div className="p-10 text-sm text-bad">Cannot load your session: {error.message}</div>;
  }
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
