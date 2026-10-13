"use client";

import { useMemo, useState } from "react";
import {
  approvalTrend,
  dpdBuckets,
  providerFailures,
  reportMetrics,
  reportTable,
} from "./reportsData";

export default function ReportsPage() {
  const [period, setPeriod] = useState("Last 6 months");

  const maxApproval = Math.max(...approvalTrend.map((item) => item.value));
  const maxDpd = Math.max(...dpdBuckets.map((item) => item.value));
  const maxProviderFailure = Math.max(
    ...providerFailures.map((item) => item.value),
  );

  const periodLabel = useMemo(() => {
    return period === "Last 30 days"
      ? "Last 30 days"
      : period === "Last 90 days"
        ? "Last 90 days"
        : "Last 6 months";
  }, [period]);

  function exportReport() {
    const header = "Metric,Value";
    const rows = reportTable.map(
      (row) =>
        `"${row.label.replace(/"/g, '""')}","${row.value.replace(/"/g, '""')}"`,
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "inpockets-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Analytics & Reporting
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Reports
            </h1>

            <p className="mt-2 text-slate-600">
              Review operational, lending, and provider performance metrics.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div>
              <label
                htmlFor="report-period"
                className="mb-1 block text-xs font-medium text-slate-500"
              >
                Period
              </label>

              <select
                id="report-period"
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
              >
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 6 months</option>
              </select>
            </div>

            <button
              type="button"
              onClick={exportReport}
              className="self-end rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Export CSV
            </button>
          </div>
        </div>

        <p className="mb-5 text-sm text-slate-500">
          Showing mock reporting data for {periodLabel}.
        </p>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {reportMetrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <p className="text-sm font-medium text-slate-600">
                {metric.label}
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {metric.value}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {metric.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-950">
                Approval Rate Trend
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Monthly approval rate during the selected reporting period.
              </p>
            </div>

            <div className="flex h-64 items-end gap-4 border-b border-slate-200 px-2 pb-0">
              {approvalTrend.map((point) => (
                <div
                  key={point.label}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-2 text-xs font-medium text-slate-600">
                    {point.value}%
                  </span>

                  <div
                    className="w-full max-w-12 rounded-t-md bg-slate-800"
                    style={{
                      height: `${(point.value / maxApproval) * 78}%`,
                    }}
                  />

                  <span className="mt-3 text-xs text-slate-500">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-950">
                DPD Buckets
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Accounts grouped by days past due.
              </p>
            </div>

            <div className="space-y-5">
              {dpdBuckets.map((point) => (
                <div key={point.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {point.label}
                    </span>

                    <span className="text-sm text-slate-500">
                      {point.value}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-700"
                      style={{
                        width: `${(point.value / maxDpd) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-950">
                Provider Failure Rates
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Failed external-provider requests by provider.
              </p>
            </div>

            <div className="space-y-5">
              {providerFailures.map((point) => (
                <div key={point.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">
                      {point.label}
                    </span>

                    <span className="text-sm text-slate-500">
                      {point.value}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-700"
                      style={{
                        width: `${(point.value / maxProviderFailure) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-950">
                Report Summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Exportable reporting metrics.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Metric
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Value
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {reportTable.map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {row.label}
                      </td>

                      <td className="px-6 py-4 text-right text-sm text-slate-600">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}