"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);



  useEffect(() => {
    if (!isMobileOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileOpen]);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          onClick={() => setIsMobileOpen(false)}
        >
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

        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close navigation menu"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6l12 12M18 6L6 18"
            />
          </svg>
        </button>
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
                    onClick={() => setIsMobileOpen(false)}
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
            Loan operations &amp; monitoring
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          aria-label="InPockets dashboard"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 font-bold text-white">
            I
          </span>
          <span className="font-bold text-blue-950">InPockets</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsMobileOpen((open) => !open)}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-admin-navigation"
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100"
        >
          {isMobileOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile navigation drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 h-full w-full bg-slate-950/40"
            onClick={() => setIsMobileOpen(false)}
          />

          <aside
            id="mobile-admin-navigation"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col border-r border-slate-200 bg-white shadow-xl"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
