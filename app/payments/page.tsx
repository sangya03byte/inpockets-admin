"use client";

import { useMemo, useState } from "react";
import { payments } from "./paymentData";

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !query ||
        payment.id.toLowerCase().includes(query) ||
        payment.loanId.toLowerCase().includes(query) ||
        payment.customer.toLowerCase().includes(query);

      const matchesStatus =
        status === "ALL" || payment.status === status;

      const matchesFromDate =
        !fromDate || payment.paymentDate >= fromDate;

      const matchesToDate =
        !toDate || payment.paymentDate <= toDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [search, status, fromDate, toDate]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Loans & Payments
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Payment Monitoring
          </h1>

          <p className="mt-2 text-slate-600">
            Review payment activity and filter records by status and date.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <div className="grid gap-4 xl:grid-cols-4">
              <div className="xl:col-span-1">
                <label
                  htmlFor="payment-search"
                  className="block text-sm font-medium text-slate-700"
                >
                  Search
                </label>

                <input
                  id="payment-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Payment, loan, customer..."
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
                />
              </div>

              <div>
                <label
                  htmlFor="payment-status"
                  className="block text-sm font-medium text-slate-700"
                >
                  Status
                </label>

                <select
                  id="payment-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
                >
                  <option value="ALL">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUCCESSFUL">Successful</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="from-date"
                  className="block text-sm font-medium text-slate-700"
                >
                  From
                </label>

                <input
                  id="from-date"
                  type="date"
                  value={fromDate}
                  onChange={(event) => setFromDate(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label
                  htmlFor="to-date"
                  className="block text-sm font-medium text-slate-700"
                >
                  To
                </label>

                <input
                  id="to-date"
                  type="date"
                  value={toDate}
                  onChange={(event) => setToDate(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Payment
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
                    Payment Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-950">
                        {payment.id}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {payment.loanId}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-700">
                      {payment.customer}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-slate-900">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {payment.paymentDate}
                    </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No payments match the selected filters.
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