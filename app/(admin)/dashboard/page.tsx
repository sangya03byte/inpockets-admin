"use client";

import Link from "next/link";
import { dashboardItems } from "./dashboardData";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Admin Panel
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Overview of items currently requiring attention.
          </p>
        </div>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dashboardItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-slate-600">
                  {item.label}
                </p>

                <span className="text-3xl font-semibold text-slate-950">
                  {item.count}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                {item.description}
              </p>

              <p className="mt-5 text-sm font-medium text-slate-700 group-hover:text-slate-950">
                View details →
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}