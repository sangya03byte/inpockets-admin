"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  applicationRecords,
  ApplicationState,
  ApplicationStatus,
} from "./applicationData";

function getStatusClasses(status: ApplicationStatus) {
  if (status === "Manual Review") {
    return "bg-amber-100 text-amber-700";
  }

  if (status === "Pending Provider") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "Approved") {
    return "bg-green-100 text-green-700";
  }

  return "bg-red-100 text-red-700";
}

function getStateClasses(state: ApplicationState) {
  if (state === "MANUAL_REVIEW") {
    return "bg-amber-50 text-amber-700";
  }

  if (state === "PENDING_EXTERNAL_PROVIDER") {
    return "bg-blue-50 text-blue-700";
  }

  if (state === "APPROVED") {
    return "bg-green-50 text-green-700";
  }

  return "bg-red-50 text-red-700";
}

export default function ApplicationsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [submittedStatus, setSubmittedStatus] = useState("All statuses");

  const filteredApplications = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLowerCase();

    return applicationRecords.filter((application) => {
      const matchesQuery =
        normalizedQuery === "" ||
        application.applicationId.toLowerCase().includes(normalizedQuery) ||
        application.customerId.toLowerCase().includes(normalizedQuery) ||
        application.customerName.toLowerCase().includes(normalizedQuery) ||
        application.loanType.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        submittedStatus === "All statuses" ||
        application.status === submittedStatus;

      return matchesQuery && matchesStatus;
    });
  }, [submittedQuery, submittedStatus]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmittedQuery(query);
    setSubmittedStatus(status);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Application Review Queue
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Review loan applications that require underwriting or manual
            verification.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by application ID, customer ID, customer name, or loan type..."
              aria-label="Search applications"
              className="h-16 flex-1 rounded-xl border border-slate-300 px-5 text-lg text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by application status"
              className="h-16 rounded-xl border border-slate-300 bg-white px-5 text-lg text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 lg:w-64"
            >
              <option>All statuses</option>
              <option>Manual Review</option>
              <option>Pending Provider</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            <button
              type="submit"
              className="h-16 rounded-xl bg-slate-950 px-8 text-lg font-semibold text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Applications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredApplications.length} application
                  {filteredApplications.length === 1 ? "" : "s"} found
                </p>
              </div>

              <span className="text-sm text-slate-500">
                Mock review data
              </span>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No applications found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing the search text or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Application
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Loan Type
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      State
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Submitted
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map((application) => (
                    <tr
                      key={application.applicationId}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <Link
                          href={`/applications/${application.applicationId}`}
                          className="font-semibold text-slate-950 hover:underline"
                        >
                          {application.applicationId}
                        </Link>

                        <p className="mt-1 text-sm text-slate-500">
                          {application.customerId}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {application.customerName}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {application.loanType}
                      </td>

                      <td className="px-6 py-5 font-medium text-slate-900">
                        ₹{application.requestedAmount.toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStateClasses(
                            application.state
                          )}`}
                        >
                          {application.state}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500">
                        {application.submitted}
                      </td>

                      <td className="px-6 py-5">
                        <Link
                          href={`/applications/${application.applicationId}`}
                          className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-500 hover:bg-slate-50"
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