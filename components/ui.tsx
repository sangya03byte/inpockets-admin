"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ButtonHTMLAttributes,
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Icon } from "./Icon";
import { humanize, initials } from "@/lib/format";

/* ───────────────────────── Status & tone ───────────────────────── */

export type Tone = "neutral" | "brand" | "ok" | "warn" | "bad";

const TONE_BY_STATUS: Record<string, Tone> = {
  // good
  VERIFIED: "ok", APPROVED: "ok", ACTIVE: "ok", SUCCESS: "ok", SUCCESSFUL: "ok", MATCHED: "ok",
  CLEARED: "ok", RESOLVED: "ok", DISBURSED: "ok", PAID: "ok", LOW: "ok", AUTO_APPROVED: "ok",
  COMPLETED: "ok", PUBLISHED: "ok", ENABLED: "ok", ON_TRACK: "ok", PASSED: "ok", KEPT: "ok",
  // needs a human
  MANUAL_REVIEW: "warn", PENDING_INFORMATION: "warn", REQUIRES_REVIEW: "warn", MEDIUM: "warn",
  REVIEW: "warn", DUE: "warn", IN_PROGRESS: "warn", PROMISE_TO_PAY: "warn", AT_RISK: "warn",
  DRAFT: "warn", PENDING_APPROVAL: "warn", ACTION_REQUIRED: "warn", WAITING_ON_CUSTOMER: "warn",
  // bad
  REJECTED: "bad", FAILED: "bad", OVERDUE: "bad", HIGH: "bad", MISMATCH: "bad", SUSPENDED: "bad",
  BLOCKED: "bad", CRITICAL: "bad", REVERSED: "bad", BREACHED: "bad", ESCALATED: "bad", BROKEN: "bad",
  // in flight
  PENDING: "brand", PROCESSING: "brand", PENDING_PROVIDER: "brand", PENDING_EXTERNAL_PROVIDER: "brand",
  OPEN: "brand", INITIATED: "brand", IN_REVIEW: "brand", PENDING_DISBURSEMENT: "brand",
  READY_FOR_DISBURSEMENT: "brand", ASSIGNED: "brand", SUBMITTED: "brand", UNDER_REVIEW: "brand",
  // quiet
  CLOSED: "neutral", INACTIVE: "neutral", ARCHIVED: "neutral", SUPERSEDED: "neutral", NEW: "neutral",
};

export function statusTone(status: string): Tone {
  return TONE_BY_STATUS[status.trim().toUpperCase().replace(/[\s-]+/g, "_")] ?? "neutral";
}

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-brand-50 text-muted ring-line-strong",
  brand: "bg-info-soft text-brand-700 ring-brand-200",
  ok: "bg-ok-soft text-ok ring-[#bfe6d4]",
  warn: "bg-warn-soft text-warn ring-[#f5d9aa]",
  bad: "bg-bad-soft text-bad ring-[#f6c5c2]",
};

const DOT_CLASS: Record<Tone, string> = {
  neutral: "bg-faint",
  brand: "bg-brand-500",
  ok: "bg-ok",
  warn: "bg-warn",
  bad: "bg-bad",
};

export function Badge({ tone = "neutral", children, dot = true }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASS[tone]}`}
    >
      {dot && <span className={`size-1.5 shrink-0 rounded-full ${DOT_CLASS[tone]}`} />}
      <span className="truncate">{children}</span>
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTone(status)}>{humanize(status)}</Badge>;
}

/* ───────────────────────── Buttons ───────────────────────── */

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";

const VARIANT: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  secondary: "bg-surface text-ink ring-1 ring-inset ring-line-strong hover:bg-brand-50",
  ghost: "text-brand-700 hover:bg-brand-50",
  danger: "bg-bad text-white hover:bg-[#a52a24] shadow-sm",
  success: "bg-ok text-white hover:bg-[#0a6747] shadow-sm",
};

const BTN_BASE =
  "inline-flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  variant = "secondary",
  className = "",
  type = "button",
  ...rest
}: { variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`${BTN_BASE} ${VARIANT[variant]} ${className}`} {...rest} />;
}

export function LinkButton({
  href,
  variant = "secondary",
  children,
  className = "",
}: {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`${BTN_BASE} ${VARIANT[variant]} ${className}`}>
      {children}
    </Link>
  );
}

/* ───────────────────────── Page chrome ───────────────────────── */

export function PageHeader({
  crumbs,
  title,
  description,
  actions,
  badge,
}: {
  crumbs?: { label: string; href?: string }[];
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <header className="mb-6 flex min-w-0 items-start justify-between gap-6">
      <div className="min-w-0">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs text-muted">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <Icon name="chevronRight" size={12} className="text-faint" />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-brand-700">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="wrap-any min-w-0 text-[26px] font-semibold leading-tight">{title}</h1>
          {badge}
        </div>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Card({
  title,
  description,
  action,
  children,
  flush = false,
  className = "",
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  /** Remove body padding (tables, lists that bleed to the edge). */
  flush?: boolean;
  className?: string;
}) {
  return (
    <section className={`min-w-0 rounded-xl bg-surface shadow-card ring-1 ring-line ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={flush ? "" : "p-5"}>{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone,
  href,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: Tone;
  href?: string;
}) {
  const inner = (
    <div className="min-w-0 rounded-xl bg-surface p-5 shadow-card ring-1 ring-line transition-colors hover:ring-brand-300">
      <p className="truncate text-xs font-medium text-muted">{label}</p>
      <p className="num mt-2 truncate font-display text-[28px] font-semibold leading-none text-ink">{value}</p>
      {hint && (
        <p
          className={`mt-2 truncate text-xs ${
            tone === "bad" ? "text-bad" : tone === "warn" ? "text-warn" : tone === "ok" ? "text-ok" : "text-muted"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
  return href ? (
    <Link href={href} className="block min-w-0">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export function Grid({ cols = 4, children, className = "" }: { cols?: 2 | 3 | 4 | 5; children: ReactNode; className?: string }) {
  const c = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" }[cols];
  return <div className={`grid gap-4 ${c} ${className}`}>{children}</div>;
}

export function Notice({ tone = "brand", children }: { tone?: Tone; children: ReactNode }) {
  const cls: Record<Tone, string> = {
    neutral: "bg-brand-50 text-muted ring-line",
    brand: "bg-info-soft text-brand-800 ring-brand-200",
    ok: "bg-ok-soft text-ok ring-[#bfe6d4]",
    warn: "bg-warn-soft text-warn ring-[#f5d9aa]",
    bad: "bg-bad-soft text-bad ring-[#f6c5c2]",
  };
  return (
    <div role={tone === "bad" ? "alert" : "status"} className={`wrap-any mb-5 rounded-lg px-4 py-3 text-sm ring-1 ring-inset ${cls[tone]}`}>
      {children}
    </div>
  );
}

/* ───────────────────────── Data display ───────────────────────── */

export function DefList({ items, cols = 2 }: { items: { label: string; value: ReactNode }[]; cols?: 1 | 2 | 3 }) {
  const c = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" }[cols];
  return (
    <dl className={`grid gap-x-8 gap-y-4 ${c}`}>
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="text-xs text-muted">{it.label}</dt>
          <dd className="wrap-any mt-0.5 text-sm font-medium text-ink">{it.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <span
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700"
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

export function Person({ name, sub, href }: { name: string; sub?: string; href?: string }) {
  const body = (
    <span className="flex min-w-0 items-center gap-3">
      <Avatar name={name} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-ink">{name}</span>
        {sub && <span className="block truncate text-xs text-muted">{sub}</span>}
      </span>
    </span>
  );
  return href ? (
    <Link href={href} className="min-w-0 hover:text-brand-700">
      {body}
    </Link>
  ) : (
    body
  );
}

export function Timeline({
  items,
}: {
  items: { title: ReactNode; meta?: ReactNode; body?: ReactNode; tone?: Tone }[];
}) {
  return (
    <ol className="relative space-y-5">
      <span className="absolute bottom-1 left-[5px] top-1 w-px bg-line" aria-hidden="true" />
      {items.map((it, i) => (
        <li key={i} className="relative min-w-0 pl-6">
          <span
            className={`absolute left-0 top-1.5 size-[11px] rounded-full ring-4 ring-surface ${DOT_CLASS[it.tone ?? "brand"]}`}
            aria-hidden="true"
          />
          <p className="wrap-any text-sm font-medium text-ink">{it.title}</p>
          {it.meta && <p className="text-xs text-muted">{it.meta}</p>}
          {it.body && <p className="wrap-any mt-1 text-sm text-body">{it.body}</p>}
        </li>
      ))}
    </ol>
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <Icon name="search" />
      </span>
      <p className="text-sm font-semibold text-ink">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function NotFoundState({ what, backHref, backLabel }: { what: string; backHref: string; backLabel: string }) {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl bg-surface p-10 text-center shadow-card ring-1 ring-line">
      <h1 className="text-xl font-semibold">{what} not found</h1>
      <p className="mt-2 text-sm text-muted">It may have been removed, or the link is incorrect.</p>
      <div className="mt-6 flex justify-center">
        <LinkButton href={backHref} variant="primary">
          {backLabel}
        </LinkButton>
      </div>
    </div>
  );
}

/** A thin horizontal bar used for risk bands, SLA use, policy utilisation. */
export function Meter({ value, max = 100, tone = "brand", label }: { value: number; max?: number; tone?: Tone; label?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill: Record<Tone, string> = {
    neutral: "bg-faint",
    brand: "bg-brand-500",
    ok: "bg-ok",
    warn: "bg-[#e39a2d]",
    bad: "bg-bad",
  };
  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100"
    >
      <div className={`h-full rounded-full ${fill[tone]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ───────────────────────── Tables & filters ───────────────────────── */

export type Column<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
  /** Set a min width (px) for columns that must not collapse. */
  minWidth?: number;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  rowHref,
  onRowClick,
  empty,
  maxHeight,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  rowHref?: (row: T) => string;
  /** Alternative to rowHref for rows that open a dialog or drawer. */
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  maxHeight?: number;
}) {
  const router = useRouter();

  if (rows.length === 0) {
    return <>{empty ?? <EmptyState title="Nothing to show" body="No records match the current filters." />}</>;
  }

  return (
    <div className="overflow-auto rounded-b-xl" style={maxHeight ? { maxHeight } : undefined}>
      <table className="dt">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.align === "right" ? "r" : ""} style={c.minWidth ? { minWidth: c.minWidth } : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const href = rowHref?.(row);
            const go = href ? () => router.push(href) : onRowClick ? () => onRowClick(row) : undefined;
            return (
              <tr
                key={rowKey(row)}
                data-href={go ? "1" : undefined}
                tabIndex={go ? 0 : undefined}
                onClick={go}
                onKeyDown={go ? (e) => e.key === "Enter" && go() : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} className={c.align === "right" ? "r" : ""}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function TableFooter({ shown, total, noun }: { shown: number; total: number; noun: string }) {
  return (
    <div className="border-t border-line px-5 py-3 text-xs text-muted">
      Showing {shown} of {total} {noun}
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3.5">{children}</div>;
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search",
  width = 320,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number;
}) {
  return (
    <label className="relative block" style={{ width }}>
      <span className="sr-only">{placeholder}</span>
      <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg bg-surface pl-9 pr-3 text-sm text-ink ring-1 ring-inset ring-line-strong placeholder:text-faint focus:ring-2 focus:ring-brand-500"
      />
    </label>
  );
}

export function SelectField({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-lg bg-surface pl-3 pr-9 text-sm text-ink ring-1 ring-inset ring-line-strong focus:ring-2 focus:ring-brand-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-faint" />
    </label>
  );
}

/** Pill-style filter group with optional counts. */
export function Segmented<V extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: V; label: string; count?: number }[];
  value: V;
  onChange: (v: V) => void;
}) {
  return (
    <div role="tablist" className="inline-flex rounded-lg bg-brand-50 p-0.5 ring-1 ring-inset ring-line">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(o.value)}
            className={`h-8 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors ${
              active ? "bg-surface text-ink shadow-sm ring-1 ring-line" : "text-muted hover:text-ink"
            }`}
          >
            {o.label}
            {o.count !== undefined && <span className="num ml-1.5 text-xs text-faint">{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Tabs<V extends string>({
  items,
  value,
  onChange,
}: {
  items: { value: V; label: string }[];
  value: V;
  onChange: (v: V) => void;
}) {
  return (
    <div role="tablist" className="mb-5 flex gap-6 border-b border-line">
      {items.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(t.value)}
            className={`-mb-px h-10 whitespace-nowrap border-b-2 text-sm font-medium transition-colors ${
              active ? "border-brand-600 text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Forms & dialogs ───────────────────────── */

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      {/* The wrapping <label> associates the text with the control inside it. */}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
        {children}
      </label>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "h-10 w-full rounded-lg bg-surface px-3 text-sm text-ink ring-1 ring-inset ring-line-strong placeholder:text-faint focus:ring-2 focus:ring-brand-500";

export function Dialog({
  open,
  title,
  description,
  onClose,
  children,
  width = 480,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLElement>("textarea, input, select, button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width }}
        className="flex max-h-[85vh] max-w-full flex-col rounded-2xl bg-surface shadow-pop"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 rounded-lg p-2 text-muted hover:bg-brand-50 hover:text-ink">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/** Confirm dialog that records a mandatory reason, as the policy requires for consequential actions. */
export function ReasonDialog(props: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  tone?: "primary" | "danger" | "success";
  reasonLabel?: string;
  reasonHint?: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}) {
  // Mounting the form only while open gives every opening a fresh, empty state.
  if (!props.open) return null;
  return <ReasonForm {...props} />;
}

function ReasonForm({
  title,
  description,
  confirmLabel,
  tone = "primary",
  reasonLabel = "Reason",
  reasonHint = "Recorded in the audit log with your name and role.",
  onConfirm,
  onClose,
}: {
  title: string;
  description?: string;
  confirmLabel: string;
  tone?: "primary" | "danger" | "success";
  reasonLabel?: string;
  reasonHint?: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = reason.trim();
  const invalid = touched && trimmed.length < 5;

  function submit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (trimmed.length < 5) return;
    onConfirm(trimmed);
  }

  return (
    <Dialog open title={title} description={description} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={reasonLabel} hint={invalid ? undefined : reasonHint}>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            rows={4}
            aria-invalid={invalid}
            className="w-full resize-none rounded-lg bg-surface px-3 py-2.5 text-sm text-ink ring-1 ring-inset ring-line-strong placeholder:text-faint focus:ring-2 focus:ring-brand-500 aria-[invalid=true]:ring-bad"
            placeholder="Add at least a short sentence"
          />
          {invalid && <p className="mt-1.5 text-xs text-bad">Enter a reason of at least 5 characters.</p>}
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant={tone}>
            {confirmLabel}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

/** Two-column detail layout: main content + sticky side rail. */
export function DetailLayout({ main, side }: { main: ReactNode; side: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6">
      <div className="min-w-0 space-y-6">{main}</div>
      <aside className="sticky top-6 min-w-0 space-y-6">{side}</aside>
    </div>
  );
}
