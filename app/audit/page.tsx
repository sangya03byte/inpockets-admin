"use client";

import { useMemo, useState } from "react";
import { auditLogs } from "./auditData";

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return auditLogs.filter((log) => {
      const matchesSearch =
        !query ||
        log.id.toLowerCase().includes(query) ||
        log.actor.toLowerCase().includes(query) ||
        log.entity.toLowerCase().includes(query) ||
        log.entityId.toLowerCase().includes(query) ||
        log.reason.toLowerCase().includes(query);

      const matchesAction =
        actionFilter === "ALL" || log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [search, actionFilter]);

  const actions = [...new Set(auditLogs.map((log) => log.action))];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Audit Log
          </h1>

          <p className="mt-2 text-slate-600">
            Read-only history of administrative actions and configuration
            changes.
          </p>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_260px]">
            <div>
              <label
                htmlFor="audit-search"
                className="text-sm font-medium text-slate-700"
              >
                Search
              </label>

              <input
                id="audit-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by actor, entity, ID or reason"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="audit-action"
                className="text-sm font-medium text-slate-700"
              >
                Action
              </label>

              <select
                id="audit-action"
                value={actionFilter}
                onChange={(event) => setActionFilter(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none focus:border-slate-500"
              >
                <option value="ALL">All Actions</option>

                {actions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Actor
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Action
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Entity
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Timestamp
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Reason
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <p className="font-medium">{log.actor}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {log.id}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-medium">{log.entity}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {log.entityId}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {log.timestamp}
                    </td>

                    <td className="max-w-md px-6 py-5 text-sm text-slate-600">
                      {log.reason}
                    </td>
                  </tr>
                ))}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      No audit records match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}