"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { disbursements } from "./disbursementData";

export default function DisbursementsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredDisbursements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return disbursements.filter((disbursement) => {
      const matchesSearch =
        !query ||
        disbursement.id.toLowerCase().includes(query) ||
        disbursement.loanId.toLowerCase().includes(query) ||
        disbursement.customer.toLowerCase().includes(query);

      const matchesStatus =
        status === "ALL" || disbursement.status === status;

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
            Disbursement Monitoring
          </h1>

          <p className="mt-2 text-slate-600">
            Review disbursement requests and their current processing status.
          </p>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-end">
            <div className="flex-1">
              <label
                htmlFor="disbursement-search"
                className="block text-sm font-medium text-slate-700"
              >
                Search
              </label>

              <input
                id="disbursement-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search disbursement, loan, or customer"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500"
              />
            </div>

            <div className="w-full md:w-56">
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="status-filter"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-slate-500"
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="REQUIRES_REVIEW">Requires Review</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Disbursement
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredDisbursements.map((disbursement) => (
                  <tr key={disbursement.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-950">
                        {disbursement.id}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {disbursement.loanId}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-700">
                      {disbursement.customer}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-900">
                      ₹{disbursement.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {disbursement.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {disbursement.createdAt}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/disbursements/${disbursement.id}`}
                        className="text-sm font-medium text-slate-700 hover:text-slate-950"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredDisbursements.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No disbursements match the selected filters.
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