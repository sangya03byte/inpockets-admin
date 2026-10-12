"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationGroups = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", href: "/dashboard" }],
  },
  {
    title: "CUSTOMERS & RISK",
    items: [
      { label: "Customers", href: "/customers" },
      { label: "Applications", href: "/applications" },
      { label: "KYC Review", href: "/kyc" },
      { label: "Fraud Review", href: "/fraud" },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { label: "Loans", href: "/loans" },
      { label: "Disbursements", href: "/disbursements" },
      { label: "Payments", href: "/payments" },
      { label: "Reconciliation", href: "/reconciliation" },
      { label: "Collections", href: "/collections" },
      { label: "Support", href: "/support" },
      { label: "Complaints", href: "/complaints" },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      { label: "Reports & Analytics", href: "/reports" },
      { label: "Audit Log", href: "/audit" },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      { label: "Policy Configuration", href: "/policy" },
      { label: "Admin Users", href: "/admin/users" },
      { label: "Roles & Permissions", href: "/admin/roles" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-lg font-bold text-white">
            I
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-blue-950">
              InPockets
            </p>
            <p className="text-xs text-slate-500">Admin Console</p>
          </div>
        </Link>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-7 overflow-y-auto px-4 py-6"
      >
        {navigationGroups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">
              {group.title}
            </h2>

            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-blue-950 bg-blue-50 text-blue-950"
                        : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-sm font-semibold text-slate-800">
            Admin Workspace
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Loan operations & monitoring
          </p>
        </div>
      </div>
    </aside>
  );
}
