"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Icon } from "./Icon";
import { Avatar } from "./ui";
import { useSession } from "@/lib/session";

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super admin", SENIOR_UNDERWRITER: "Senior underwriter", UNDERWRITER: "Underwriter", FINANCE: "Finance",
};

export function Topbar() {
  const router = useRouter();
  const { me, signOut } = useSession();
  const [q, setQ] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    // Application numbers (LA-...) go to the queue, everything else to customer search.
    router.push(term.toUpperCase().startsWith("LA-") ? `/applications?q=${encodeURIComponent(term)}` : `/customers?q=${encodeURIComponent(term)}`);
  }

  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-6 border-b border-line bg-surface px-8">
      <form onSubmit={onSearch} role="search" className="relative w-[420px] max-w-full">
        <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search application number (LA-…) or customer name"
          aria-label="Search customers and applications"
          className="h-9 w-full rounded-lg bg-canvas pl-9 pr-3 text-sm text-ink ring-1 ring-inset ring-line placeholder:text-faint focus:bg-surface focus:ring-2 focus:ring-brand-500"
        />
      </form>

      <div className="flex shrink-0 items-center gap-4">
        <div className="flex items-center gap-2.5 border-l border-line pl-4">
          <Avatar name={me ? (ROLE_LABEL[me.role] ?? me.role) : "…"} size={32} />
          <div className="leading-tight">
            <p className="text-sm font-medium text-ink">{me ? (ROLE_LABEL[me.role] ?? me.role) : "Loading…"}</p>
            <p className="text-xs text-muted">{me ? (me.mfa_enabled ? "MFA on" : "MFA off") : ""}</p>
          </div>
          <button type="button" aria-label="Sign out" onClick={() => void signOut()} className="ml-1 rounded-lg p-2 text-muted hover:bg-brand-50 hover:text-ink">
            <Icon name="logout" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
