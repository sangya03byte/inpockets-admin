"use client";

import { useMemo, useState } from "react";
import { auditEntries } from "./auditData";

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");

  const actions = [
    "All",
    ...Array.from(new Set(auditEntries.map((entry) => entry.action))),
  ];

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return auditEntries.filter((entry) => {
      const matchesSearch =
        !query ||
        entry.actor.toLowerCase().includes(query) ||
        entry.action.toLowerCase().includes(query) ||
        entry.entity.toLowerCase().includes(query) ||
        entry.entityId.toLowerCase().includes(query) ||
        entry.reason.toLowerCase().includes(query);

      const matchesAction =
        actionFilter === "All" || entry.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [search, actionFilter]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Admin & Audit
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Audit Log
          </h1>

          <p className="mt-2 text-slate-600">
            Review administrative actions and recorded reasons.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Activity History
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Read-only record of administrative activity.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div>
                  <label
                    htmlFor="audit-search"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Search
                  </label>

                  <input
                    id="audit-search"
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Actor, action, entity..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 sm:w-64"
                  />
                </div>

                <div>
                  <label
                    htmlFor="action-filter"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Action
                  </label>

                  <select
                    id="action-filter"
                    value={actionFilter}
                    onChange={(event) => setActionFilter(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 sm:w-64"
                  >
                    {actions.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-sm font-semibold text-slate-900">
                No audit entries found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or action filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actor
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Entity
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Timestamp
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Reason
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {entry.actor}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {entry.id}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {entry.action}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {entry.entity}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {entry.entityId}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {entry.timestamp}
                      </td>

                      <td className="max-w-md px-6 py-4 text-sm leading-6 text-slate-600">
                        {entry.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}