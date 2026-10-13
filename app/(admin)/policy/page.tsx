"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { policyRecords, PolicyStatus } from "./policyData";

const statusOptions: Array<"All" | PolicyStatus> = [
  "All",
  "Active",
  "Draft",
  "Archived",
];

const statusClasses: Record<PolicyStatus, string> = {
  Active: "bg-green-50 text-green-700",
  Draft: "bg-yellow-50 text-yellow-700",
  Archived: "bg-gray-100 text-gray-600",
};

export default function PolicyPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | PolicyStatus>("All");

  const filteredPolicies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return policyRecords.filter((policy) => {
      const matchesSearch =
        !query ||
        policy.policyId.toLowerCase().includes(query) ||
        policy.name.toLowerCase().includes(query) ||
        policy.category.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || policy.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">
            Admin / Configuration
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Policies
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Review and manage lending and operational policy configurations.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Total Policies</p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {policyRecords.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Active</p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {
                policyRecords.filter(
                  (policy) => policy.status === "Active"
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Drafts</p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {
                policyRecords.filter(
                  (policy) => policy.status === "Draft"
                ).length
              }
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Search policy..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 md:max-w-md"
            />

            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => {
                const isSelected = status === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatus(option)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Policy
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Version
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last Updated
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPolicies.map((policy) => (
                  <tr
                    key={policy.policyId}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {policy.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {policy.policyId}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {policy.category}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {policy.version}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[policy.status]}`}
                      >
                        {policy.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {policy.lastUpdated}
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        href={`/policy/${policy.policyId}`}
                        className="text-sm font-medium text-slate-900 hover:underline"
                      >
                        View Policy
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredPolicies.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No policies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}