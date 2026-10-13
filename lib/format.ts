const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** ₹12,500 — Indian digit grouping. */
export function inr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/** "13 Oct 2026" from an ISO string. Pure string maths so server and client always agree. */
export function fmtDate(iso: string): string {
  if (!iso || iso === "—") return "—";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "13 Oct 2026, 09:42" from "2026-10-13T09:42". */
export function fmtDateTime(iso: string): string {
  if (!iso) return "—";
  const time = iso.length > 10 ? iso.slice(11, 16) : "";
  return time ? `${fmtDate(iso)}, ${time}` : fmtDate(iso);
}

/** "SUPER_ADMIN" -> "Super admin". */
export function humanize(value: string): string {
  const s = value.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Whole days between two ISO dates (b - a). */
export function daysBetween(a: string, b: string): number {
  const t = (s: string) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10));
  return Math.round((t(b) - t(a)) / 86_400_000);
}

export const TODAY = "2026-10-13";

/** Fixed "now" used by the sandbox data so server and client render identically. */
export const NOW_ISO = `${TODAY}T10:30`;
