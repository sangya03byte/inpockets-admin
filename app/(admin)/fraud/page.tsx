"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fraudCases } from "./fraudData";

export default function FraudReviewPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  const filteredCases = useMemo(() => {
    const query = search.trim().toLowerCase();

    return fraudCases.filter((fraudCase) => {
      const matchesSearch =
        !query ||
        fraudCase.id.toLowerCase().includes(query) ||
        fraudCase.applicationId.toLowerCase().includes(query) ||
        fraudCase.customer.toLowerCase().includes(query) ||
        fraudCase.deviceId.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || fraudCase.status === statusFilter;

      const matchesRisk =
        riskFilter === "All" || fraudCase.riskBand === riskFilter;

      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [search, statusFilter, riskFilter]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            KYC & Fraud
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Fraud Review
          </h1>

          <p className="mt-2 text-slate-600">
            Review flagged applications, devices, and fraud signals.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Fraud Review Queue
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Applications and devices requiring fraud investigation.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="fraud-search"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Search
                  </label>

                  <input
                    id="fraud-search"
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Case, application, customer..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 sm:w-64"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fraud-status"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Status
                  </label>

                  <select
                    id="fraud-status"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                  >
                    <option value="All">All</option>
                    <option value="MANUAL_REVIEW">MANUAL_REVIEW</option>
                    <option value="ESCALATED">ESCALATED</option>
                    <option value="CLEARED">CLEARED</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="fraud-risk"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Risk Band
                  </label>

                  <select
                    id="fraud-risk"
                    value={riskFilter}
                    onChange={(event) => setRiskFilter(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                  >
                    <option value="All">All</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {filteredCases.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-sm font-semibold text-slate-900">
                No fraud cases found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Case
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Device
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Risk
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Signals
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredCases.map((fraudCase) => (
                    <tr
                      key={fraudCase.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {fraudCase.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {fraudCase.applicationId}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {fraudCase.customer}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {fraudCase.submittedAt}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {fraudCase.deviceId}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {fraudCase.riskBand}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {fraudCase.status}
                        </span>
                      </td>

                      <td className="max-w-sm px-6 py-4">
                        <p className="text-sm text-slate-600">
                          {fraudCase.signals.length} signal
                          {fraudCase.signals.length === 1 ? "" : "s"}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {fraudCase.signals[0]}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/fraud/${fraudCase.id}`}
                          className="text-sm font-medium text-slate-700 hover:text-slate-950"
                        >
                          Review →
                        </Link>
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