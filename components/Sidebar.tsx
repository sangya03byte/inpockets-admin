"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./Icon";

type NavItem = { label: string; href: string; icon: IconName };

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: "dashboard" }],
  },
  {
    title: "Underwriting",
    items: [
      { label: "Applications", href: "/applications", icon: "file" },
      { label: "Customers", href: "/customers", icon: "users" },
      { label: "KYC review", href: "/kyc", icon: "id" },
      { label: "Fraud review", href: "/fraud", icon: "shield" },
    ],
  },
  {
    title: "Money movement",
    items: [
      { label: "Loans", href: "/loans", icon: "coins" },
      { label: "Disbursements", href: "/disbursements", icon: "send" },
      { label: "Payments", href: "/payments", icon: "card" },
      { label: "Reconciliation", href: "/reconciliation", icon: "scale" },
    ],
  },
  {
    title: "Servicing",
    items: [
      { label: "Collections", href: "/collections", icon: "phone" },
      { label: "Support", href: "/support", icon: "chat" },
      { label: "Complaints", href: "/complaints", icon: "alert" },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Reports", href: "/reports", icon: "chart" },
      { label: "Audit log", href: "/audit", icon: "log" },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Lending policy", href: "/policy", icon: "sliders" },
      { label: "Admin users", href: "/admin/users", icon: "user" },
      { label: "Roles & permissions", href: "/admin/roles", icon: "key" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-line bg-surface">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-5">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 font-display text-base font-bold text-white">
            I
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[15px] font-semibold leading-tight text-ink">InPockets</span>
            <span className="block text-[11px] leading-tight text-muted">Operations console</span>
          </span>
        </Link>
      </div>

      <nav aria-label="Main" className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {GROUPS.map((group) => (
          <div key={group.title} className="mb-5 last:mb-0">
            <p className="mb-1.5 px-3 text-xs font-medium text-faint">{group.title}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                        active ? "bg-brand-100 text-brand-800" : "text-muted hover:bg-brand-50 hover:text-ink"
                      }`}
                    >
                      <Icon name={item.icon} size={17} className={active ? "text-brand-600" : "text-faint"} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
