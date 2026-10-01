"use client";

import { useMemo, useState } from "react";
import { reconciliationRecords } from "./reconciliationData";

export default function ReconciliationPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reconciliationRecords.filter((record) => {
      const matchesSearch =
        !query ||
        record.id.toLowerCase().includes(query) ||
        record.transactionId.toLowerCase().includes(query);

      const matchesStatus =
        status === "ALL" || record.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Loans & Payments
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Reconciliation
          </h1>

          <p className="mt-2 text-slate-600">
            Review differences between the internal ledger, provider, and
            bank records.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="reconciliation-search"
                  className="block text-sm font-medium text-slate-700"
                >
                  Search
                </label>

                <input
                  id="reconciliation-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Record or transaction ID..."
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
                />
              </div>

              <div>
                <label
                  htmlFor="reconciliation-status"
                  className="block text-sm font-medium text-slate-700"
                >
                  Match Status
                </label>

                <select
                  id="reconciliation-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
                >
                  <option value="ALL">All</option>
                  <option value="MATCHED">Matched</option>
                  <option value="MISMATCH">Mismatch</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Record
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Our Ledger
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Provider
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Bank
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-950">
                        {record.id}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {record.transactionId}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-700">
                      {record.type}
                    </td>

                    <td className="px-6 py-5 text-right text-sm text-slate-700">
                      ₹{record.ourLedgerAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5 text-right text-sm text-slate-700">
                      ₹{record.providerAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5 text-right text-sm text-slate-700">
                      ₹{record.bankAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {record.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {record.date}
                    </td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No reconciliation records match the selected filters.
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