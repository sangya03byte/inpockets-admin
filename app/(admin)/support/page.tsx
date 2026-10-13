"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  supportRecords,
  SupportPriority,
  SupportStatus,
} from "./supportData";

function getStatusClasses(status: SupportStatus) {
  if (status === "Open") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "In Progress") {
    return "bg-amber-100 text-amber-700";
  }

  if (status === "Resolved") {
    return "bg-green-100 text-green-700";
  }

  return "bg-red-100 text-red-700";
}

function getPriorityClasses(priority: SupportPriority) {
  if (priority === "High") {
    return "bg-red-100 text-red-700";
  }

  if (priority === "Medium") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function SupportPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SupportStatus | "All">(
    "All"
  );

  const filteredTickets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return supportRecords.filter((ticket) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        ticket.ticketId.toLowerCase().includes(normalizedSearch) ||
        ticket.customerId.toLowerCase().includes(normalizedSearch) ||
        ticket.customerName.toLowerCase().includes(normalizedSearch) ||
        ticket.subject.toLowerCase().includes(normalizedSearch) ||
        ticket.category.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Customer Support
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Support Queue
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Review customer complaints, enquiries, and support requests.
          </p>
        </div>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label
                htmlFor="support-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search
              </label>

              <input
                id="support-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by ticket, customer, subject, or category..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="w-full md:w-56">
              <label
                htmlFor="status-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as SupportStatus | "All"
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="All">All statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Support Tickets
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredTickets.length} ticket
                {filteredTickets.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-950">
                No support tickets found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Ticket
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Subject
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
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
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.ticketId}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-950">
                          {ticket.ticketId}
                        </div>

                        <div className="mt-1 font-mono text-xs text-slate-500">
                          {ticket.state}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="font-semibold text-slate-950">
                          {ticket.customerName}
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          {ticket.customerId}
                        </div>
                      </td>

                      <td className="max-w-xs px-6 py-5">
                        <p className="truncate font-medium text-slate-900">
                          {ticket.subject}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        {ticket.category}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/support/${ticket.ticketId}`}
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