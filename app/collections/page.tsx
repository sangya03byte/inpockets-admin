"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  collectionRecords,
  CollectionPriority,
  CollectionStatus,
} from "./collectionsData";

function getStatusClasses(status: CollectionStatus) {
  if (status === "Overdue") {
    return "bg-red-100 text-red-700";
  }

  if (status === "Promise to Pay") {
    return "bg-amber-100 text-amber-700";
  }

  if (status === "Contacted") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "Escalated") {
    return "bg-purple-100 text-purple-700";
  }

  return "bg-green-100 text-green-700";
}

function getPriorityClasses(priority: CollectionPriority) {
  if (priority === "High") {
    return "bg-red-100 text-red-700";
  }

  if (priority === "Medium") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function CollectionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    CollectionStatus | "All"
  >("All");

  const filteredAccounts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return collectionRecords.filter((account) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        account.accountId.toLowerCase().includes(normalizedSearch) ||
        account.customerId.toLowerCase().includes(normalizedSearch) ||
        account.customerName.toLowerCase().includes(normalizedSearch) ||
        account.loanId.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || account.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Collections
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Collections Queue
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Review overdue accounts, repayment follow-ups, and collection
            actions.
          </p>
        </div>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label
                htmlFor="collection-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search
              </label>

              <input
                id="collection-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by account, customer, or loan..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="w-full md:w-56">
              <label
                htmlFor="collection-status"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Status
              </label>

              <select
                id="collection-status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as CollectionStatus | "All"
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="All">All statuses</option>
                <option value="Overdue">Overdue</option>
                <option value="Promise to Pay">Promise to Pay</option>
                <option value="Contacted">Contacted</option>
                <option value="Escalated">Escalated</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Collection Accounts
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredAccounts.length} account
                {filteredAccounts.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          {filteredAccounts.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-950">
                No collection accounts found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Account
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Overdue Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Days Overdue
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Priority
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr
                      key={account.accountId}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-950">
                          {account.accountId}
                        </div>

                        <div className="mt-1 font-mono text-xs text-slate-500">
                          {account.state}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {account.loanId}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-950">
                          {account.customerName}
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          {account.customerId}
                        </div>
                      </td>

                      <td className="px-6 py-5 font-semibold text-slate-950">
                        {formatCurrency(account.overdueAmount)}
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-semibold text-slate-900">
                          {account.daysOverdue}
                        </span>

                        <span className="ml-1 text-sm text-slate-500">
                          days
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                            account.priority
                          )}`}
                        >
                          {account.priority}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            account.status
                          )}`}
                        >
                          {account.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/collections/${account.accountId}`}
                          className="inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Review
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