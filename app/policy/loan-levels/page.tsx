"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { loanLevels } from "../loanLevelsData";

export default function LoanLevelsPage() {
  const [search, setSearch] = useState("");
  const [decisionMode, setDecisionMode] = useState("ALL");

  const filteredLevels = useMemo(() => {
    const query = search.trim().toLowerCase();

    return loanLevels.filter((level) => {
      const matchesSearch =
        !query ||
        level.id.toLowerCase().includes(query) ||
        level.name.toLowerCase().includes(query);

      const matchesDecisionMode =
        decisionMode === "ALL" || level.decisionMode === decisionMode;

      return matchesSearch && matchesDecisionMode;
    });
  }, [search, decisionMode]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/policy"
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            ← Back to Policy
          </Link>

          <p className="mt-6 text-sm font-medium text-slate-500">
            Policy & Configuration
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Loan Levels
          </h1>

          <p className="mt-2 text-slate-600">
            Configure loan amount, tenure, and decision rules for each level.
          </p>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by level ID or name..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />

            <select
              value={decisionMode}
              onChange={(event) => setDecisionMode(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            >
              <option value="ALL">All Decision Modes</option>
              <option value="AUTO">Auto</option>
              <option value="MANUAL_REVIEW">Manual Review</option>
            </select>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {filteredLevels.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <h2 className="text-lg font-semibold">No loan levels found</h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing the search or decision mode filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold">
                      Level
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold">
                      Minimum Amount
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold">
                      Maximum Amount
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold">
                      Max Tenure
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold">
                      Decision Mode
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLevels.map((level) => (
                    <tr
                      key={level.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium">{level.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {level.id}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-medium">
                        ₹{level.minAmount.toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        ₹{level.maxAmount.toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4">
                        {level.maxTenureMonths} months
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {level.decisionMode === "AUTO"
                            ? "AUTO"
                            : "MANUAL REVIEW"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/policy/loan-levels/${level.id}`}
                          className="text-sm font-medium text-slate-700 hover:text-slate-950"
                        >
                          View
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