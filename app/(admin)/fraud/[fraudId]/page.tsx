"use client";

import Link from "next/link";
import { useState } from "react";
import { fraudCases } from "../fraudData";

type PageProps = {
  params: Promise<{
    fraudId: string;
  }>;
};

export default function FraudDetailPage({ params }: PageProps) {
  const [caseId, setCaseId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  async function loadCase() {
    const resolvedParams = await params;
    setCaseId(resolvedParams.fraudId);
  }

  if (caseId === null) {
    loadCase();
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm text-slate-500">Loading fraud case...</p>
        </div>
      </main>
    );
  }

  const fraudCase = fraudCases.find((item) => item.id === caseId);

  if (!fraudCase) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-slate-500">
            KYC & Fraud
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Fraud case not found
          </h1>

          <p className="mt-2 text-slate-600">
            The requested fraud review case does not exist.
          </p>

          <Link
            href="/fraud"
            className="mt-6 inline-block text-sm font-medium text-slate-700 hover:text-slate-950"
          >
            ← Back to Fraud Review
          </Link>
        </div>
      </main>
    );
  }

  function handleAction(action: "CLEAR" | "ESCALATE") {
    if (!reason.trim()) {
      setMessage("A reason is required before recording this action.");
      return;
    }

    setMessage(
      `${action === "CLEAR" ? "Case cleared" : "Case escalated"} successfully. Reason recorded locally for this mock flow.`,
    );
    setReason("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            href="/fraud"
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            ← Back to Fraud Review
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            KYC & Fraud
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {fraudCase.id}
              </h1>

              <p className="mt-2 text-slate-600">
                Review fraud signals associated with application{" "}
                {fraudCase.applicationId}.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {fraudCase.status}
            </span>
          </div>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            {message}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Case Details</h2>

            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Customer
                </dt>

                <dd className="mt-1 text-sm text-slate-900">
                  {fraudCase.customer}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Application
                </dt>

                <dd className="mt-1 text-sm text-slate-900">
                  {fraudCase.applicationId}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Device
                </dt>

                <dd className="mt-1 text-sm text-slate-900">
                  {fraudCase.deviceId}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Risk Band
                </dt>

                <dd className="mt-1">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {fraudCase.riskBand}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Submitted
                </dt>

                <dd className="mt-1 text-sm text-slate-900">
                  {fraudCase.submittedAt}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Fraud Signals</h2>

            <p className="mt-1 text-sm text-slate-500">
              Signals that require reviewer attention.
            </p>

            <ul className="mt-6 space-y-3">
              {fraudCase.signals.map((signal) => (
                <li
                  key={signal}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  {signal}
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Review Action</h2>

          <p className="mt-1 text-sm text-slate-500">
            Record a reason before clearing or escalating this case.
          </p>

          <div className="mt-6">
            <label
              htmlFor="fraud-reason"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Reason
            </label>

            <textarea
              id="fraud-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={4}
              placeholder="Enter the reason for this action..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleAction("CLEAR")}
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Clear Case
            </button>

            <button
              type="button"
              onClick={() => handleAction("ESCALATE")}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Escalate Case
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}