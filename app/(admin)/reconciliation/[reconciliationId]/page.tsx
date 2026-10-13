"use client";

import Link from "next/link";
import { useState } from "react";
import { reconciliationRecords } from "../reconciliationData";

type PageProps = {
  params: Promise<{
    reconciliationId: string;
  }>;
};

export default function ReconciliationDetailPage({
  params,
}: PageProps) {
  const [reconciliationId, setReconciliationId] = useState<string | null>(
    null,
  );
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolved, setResolved] = useState(false);

  useState(() => {
    params.then(({ reconciliationId: id }) => {
      setReconciliationId(id);
    });
  });

  if (!reconciliationId) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-600">Loading...</p>
        </div>
      </main>
    );
  }

  const record = reconciliationRecords.find(
    (item) => item.id === reconciliationId,
  );

  if (!record) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-slate-500">
            Loans & Payments
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Reconciliation record not found
          </h1>

          <p className="mt-2 text-slate-600">
            The requested reconciliation record does not exist.
          </p>

          <Link
            href="/reconciliation"
            className="mt-6 inline-block text-sm font-medium text-slate-700 hover:text-slate-950"
          >
            ← Back to Reconciliation
          </Link>
        </div>
      </main>
    );
  }

  const difference = record.ourLedgerAmount - record.bankAmount;

  const handleResolve = () => {
    if (!resolutionNotes.trim()) {
      return;
    }

    setResolved(true);
    setShowResolveModal(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/reconciliation"
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to Reconciliation
        </Link>

        <div className="mb-8 mt-6">
          <p className="text-sm font-medium text-slate-500">
            Loans & Payments
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {record.id}
              </h1>

              <p className="mt-2 text-slate-600">
                Reconciliation details for {record.transactionId}.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {resolved ? "RESOLVED" : record.status}
            </span>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Our Ledger
            </p>

            <p className="mt-2 text-2xl font-semibold">
              ₹{record.ourLedgerAmount.toLocaleString("en-IN")}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Provider
            </p>

            <p className="mt-2 text-2xl font-semibold">
              ₹{record.providerAmount.toLocaleString("en-IN")}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Bank
            </p>

            <p className="mt-2 text-2xl font-semibold">
              ₹{record.bankAmount.toLocaleString("en-IN")}
            </p>
          </article>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Record Details</h2>

          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Transaction</dt>
              <dd className="mt-1 font-medium">{record.transactionId}</dd>
            </div>

            <div>
              <dt className="text-sm text-slate-500">Type</dt>
              <dd className="mt-1 font-medium">{record.type}</dd>
            </div>

            <div>
              <dt className="text-sm text-slate-500">Date</dt>
              <dd className="mt-1 font-medium">{record.date}</dd>
            </div>

            <div>
              <dt className="text-sm text-slate-500">
                Ledger vs Bank Difference
              </dt>
              <dd className="mt-1 font-medium">
                ₹{Math.abs(difference).toLocaleString("en-IN")}
              </dd>
            </div>
          </dl>

          {record.notes && (
            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                Existing Notes
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {record.notes}
              </p>
            </div>
          )}

          {resolved && resolutionNotes && (
            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                Resolution Notes
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {resolutionNotes}
              </p>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Resolution</h2>

          <p className="mt-1 text-sm text-slate-500">
            Add notes explaining how the reconciliation mismatch was resolved.
          </p>

          <button
            type="button"
            disabled={record.status === "MATCHED" || resolved}
            onClick={() => setShowResolveModal(true)}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {resolved ? "Resolved" : "Mark Resolved"}
          </button>
        </section>
      </div>

      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-950">
              Mark Reconciliation Resolved
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Add notes explaining the resolution before completing this
              action.
            </p>

            <label
              htmlFor="resolution-notes"
              className="mt-5 block text-sm font-medium text-slate-700"
            >
              Resolution Notes
            </label>

            <textarea
              id="resolution-notes"
              value={resolutionNotes}
              onChange={(event) => setResolutionNotes(event.target.value)}
              placeholder="Enter resolution details..."
              rows={5}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowResolveModal(false);
                  setResolutionNotes("");
                }}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!resolutionNotes.trim()}
                onClick={handleResolve}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}