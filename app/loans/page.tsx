"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { loans } from "./loanData";

export default function LoansPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLoans = useMemo(() => {
    const query = search.trim().toLowerCase();

    return loans.filter((loan) => {
      const matchesSearch =
        !query ||
        loan.id.toLowerCase().includes(query) ||
        loan.applicationId.toLowerCase().includes(query) ||
        loan.customer.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || loan.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  function formatAmount(amount: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Loans & Payments
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Loan Monitoring
          </h1>

          <p className="mt-2 text-slate-600">
            Review loan status, balances, disbursements, and upcoming dues.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Loan Queue
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current loan records available for monitoring.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="loan-search"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Search
                  </label>

                  <input
                    id="loan-search"
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Loan, application, customer..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 sm:w-64"
                  />
                </div>

                <div>
                  <label
                    htmlFor="loan-status"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Status
                  </label>

                  <select
                    id="loan-status"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
                  >
                    <option value="All">All</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="OVERDUE">OVERDUE</option>
                    <option value="PENDING_DISBURSEMENT">
                      PENDING_DISBURSEMENT
                    </option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {filteredLoans.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-sm font-semibold text-slate-900">
                No loans found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Loan
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Disbursed
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Outstanding
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Next Due
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {filteredLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {loan.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {loan.applicationId}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-900">
                        {loan.customer}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {loan.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right text-sm text-slate-700">
                        {formatAmount(loan.disbursedAmount)}
                      </td>

                      <td className="px-6 py-4 text-right text-sm text-slate-700">
                        {formatAmount(loan.outstandingBalance)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {loan.nextDueDate}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/loans/${loan.id}`}
                          className="text-sm font-medium text-slate-700 hover:text-slate-950"
                        >
                          View →
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