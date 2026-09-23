"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type KycSubmission = {
  kycId: string;
  customerId: string;
  customerName: string;
  document: string;
  provider: string;
  status: "Manual Review" | "Pending Provider" | "Verified";
  flag: string;
  submitted: string;
};

const demoKycSubmissions: KycSubmission[] = [
  {
    kycId: "KYC-1001",
    customerId: "CUST-1001",
    customerName: "Rahul Sharma",
    document: "Aadhaar",
    provider: "DigiLocker",
    status: "Manual Review",
    flag: "Name mismatch",
    submitted: "24 Sep 2026, 09:42 AM",
  },
  {
    kycId: "KYC-1002",
    customerId: "CUST-1002",
    customerName: "Priya Singh",
    document: "PAN",
    provider: "External KYC Provider",
    status: "Manual Review",
    flag: "Document unclear",
    submitted: "24 Sep 2026, 10:15 AM",
  },
  {
    kycId: "KYC-1003",
    customerId: "CUST-1003",
    customerName: "Amit Kumar",
    document: "Aadhaar",
    provider: "DigiLocker",
    status: "Pending Provider",
    flag: "Awaiting verification",
    submitted: "24 Sep 2026, 11:08 AM",
  },
  {
    kycId: "KYC-1004",
    customerId: "CUST-1004",
    customerName: "Neha Verma",
    document: "PAN",
    provider: "External KYC Provider",
    status: "Manual Review",
    flag: "DOB mismatch",
    submitted: "24 Sep 2026, 11:37 AM",
  },
];

export default function KycPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [submittedStatus, setSubmittedStatus] = useState("All statuses");

  const filteredSubmissions = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLowerCase();

    return demoKycSubmissions.filter((submission) => {
      const matchesQuery =
        normalizedQuery === "" ||
        submission.kycId.toLowerCase().includes(normalizedQuery) ||
        submission.customerId.toLowerCase().includes(normalizedQuery) ||
        submission.customerName.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        submittedStatus === "All statuses" ||
        submission.status === submittedStatus;

      return matchesQuery && matchesStatus;
    });
  }, [submittedQuery, submittedStatus]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmittedQuery(query);
    setSubmittedStatus(status);
  }

  function getStatusClasses(currentStatus: KycSubmission["status"]) {
    if (currentStatus === "Manual Review") {
      return "bg-amber-100 text-amber-700";
    }

    if (currentStatus === "Pending Provider") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-green-100 text-green-700";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            KYC Review Queue
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Review KYC submissions that require manual verification.
          </p>
        </div>

        {/* Search Section */}
        <form
          onSubmit={handleSearch}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 lg:flex-row">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by KYC ID, customer ID, or customer name..."
              aria-label="Search KYC submissions"
              className="h-16 flex-1 rounded-xl border border-slate-300 px-5 text-lg text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by KYC status"
              className="h-16 rounded-xl border border-slate-300 bg-white px-5 text-lg text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 lg:w-72"
            >
              <option>All statuses</option>
              <option>Manual Review</option>
              <option>Pending Provider</option>
              <option>Verified</option>
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
          {/* Results Header */}
          <div className="border-b border-slate-200 px-8 py-7">
            <h2 className="text-2xl font-bold text-slate-950">
              KYC Submissions
            </h2>

            <p className="mt-2 text-lg text-slate-500">
              {filteredSubmissions.length}{" "}
              {filteredSubmissions.length === 1
                ? "submission"
                : "submissions"}{" "}
              found
            </p>
          </div>

          {/* Empty State */}
          {filteredSubmissions.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                No KYC submissions found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            /* Table */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th
                      scope="col"
                      className="px-8 py-5 text-left text-base font-semibold text-slate-800"
                    >
                      KYC ID
                    </th>

                    <th
                      scope="col"
                      className="px-8 py-5 text-left text-base font-semibold text-slate-800"
                    >
                      Customer
                    </th>

                    <th
                      scope="col"
                      className="px-8 py-5 text-left text-base font-semibold text-slate-800"
                    >
                      Document
                    </th>

                    <th
                      scope="col"
                      className="px-8 py-5 text-left text-base font-semibold text-slate-800"
                    >
                      Provider
                    </th>

                    <th
                      scope="col"
                      className="px-8 py-5 text-left text-base font-semibold text-slate-800"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      className="px-8 py-5 text-left text-base font-semibold text-slate-800"
                    >
                      Flag
                    </th>

                    <th
                      scope="col"
                      className="px-8 py-5 text-left text-base font-semibold text-slate-800"
                    >
                      Submitted
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr
                      key={submission.kycId}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      {/* KYC ID */}
                      <td className="px-8 py-6">
                        <Link
                          href={`/kyc/${submission.kycId}`}
                          className="font-semibold text-slate-950 underline-offset-4 hover:underline"
                        >
                          {submission.kycId}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="px-8 py-6">
                        <div className="font-medium text-slate-900">
                          {submission.customerName}
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          {submission.customerId}
                        </div>
                      </td>

                      {/* Document */}
                      <td className="px-8 py-6 text-slate-700">
                        {submission.document}
                      </td>

                      {/* Provider */}
                      <td className="px-8 py-6 text-slate-700">
                        {submission.provider}
                      </td>

                      {/* Status */}
                      <td className="px-8 py-6">
                        <span
                          className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(
                            submission.status
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </td>

                      {/* Flag */}
                      <td className="px-8 py-6 text-slate-700">
                        {submission.flag}
                      </td>

                      {/* Submitted */}
                      <td className="px-8 py-6 whitespace-nowrap text-slate-500">
                        {submission.submitted}
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