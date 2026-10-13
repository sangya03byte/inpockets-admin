"use client";

import Link from "next/link";
import { use, useState } from "react";
import { loanLevels } from "../../loanLevelsData";

type PageProps = {
  params: Promise<{
    levelId: string;
  }>;
};

export default function LoanLevelDetailPage({ params }: PageProps) {
  const { levelId } = use(params);

  const level = loanLevels.find((item) => item.id === levelId);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangeCreated, setShowChangeCreated] = useState(false);

  const [minAmount, setMinAmount] = useState(
    level?.minAmount.toString() ?? "",
  );
  const [maxAmount, setMaxAmount] = useState(
    level?.maxAmount.toString() ?? "",
  );
  const [maxTenureMonths, setMaxTenureMonths] = useState(
    level?.maxTenureMonths.toString() ?? "",
  );
  const [decisionMode, setDecisionMode] = useState(
    level?.decisionMode ?? "AUTO",
  );
  const [changeReason, setChangeReason] = useState("");

  if (!level) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-slate-500">
            Policy & Configuration
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Loan level not found
          </h1>

          <p className="mt-2 text-slate-600">
            The requested loan level does not exist.
          </p>

          <Link
            href="/policy/loan-levels"
            className="mt-6 inline-block text-sm font-medium text-slate-700 hover:text-slate-950"
          >
            ← Back to Loan Levels
          </Link>
        </div>
      </main>
    );
  }

  const handleCreateChange = () => {
    if (!changeReason.trim()) {
      return;
    }

    setShowEditModal(false);
    setShowChangeCreated(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/policy/loan-levels"
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to Loan Levels
        </Link>

        <div className="mb-8 mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Policy & Configuration
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {level.name}
            </h1>

            <p className="mt-2 text-slate-600">{level.id}</p>
          </div>

          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="w-fit rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Edit Level
          </button>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Minimum Loan Amount
            </p>

            <p className="mt-2 text-2xl font-semibold">
              ₹{level.minAmount.toLocaleString("en-IN")}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Maximum Loan Amount
            </p>

            <p className="mt-2 text-2xl font-semibold">
              ₹{level.maxAmount.toLocaleString("en-IN")}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Maximum Tenure
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {level.maxTenureMonths} months
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Decision Mode
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {level.decisionMode === "AUTO"
                ? "AUTO"
                : "MANUAL REVIEW"}
            </p>
          </article>
        </section>

        {showChangeCreated && (
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold text-slate-950">
              Change created
            </p>

            <p className="mt-1 text-sm text-slate-600">
              A draft configuration change has been created for this loan
              level. The current configuration remains unchanged until the
              backend workflow is connected.
            </p>

            <div className="mt-4 rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                Change reason
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {changeReason}
              </p>
            </div>
          </section>
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">
              Create Configuration Change
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Changes are created as a new configuration change. The existing
              level is not silently overwritten.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="minAmount"
                  className="text-sm font-medium text-slate-700"
                >
                  Minimum Amount
                </label>

                <input
                  id="minAmount"
                  type="number"
                  value={minAmount}
                  onChange={(event) => setMinAmount(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="maxAmount"
                  className="text-sm font-medium text-slate-700"
                >
                  Maximum Amount
                </label>

                <input
                  id="maxAmount"
                  type="number"
                  value={maxAmount}
                  onChange={(event) => setMaxAmount(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="maxTenure"
                  className="text-sm font-medium text-slate-700"
                >
                  Maximum Tenure
                </label>

                <input
                  id="maxTenure"
                  type="number"
                  value={maxTenureMonths}
                  onChange={(event) =>
                    setMaxTenureMonths(event.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900"
                />
              </div>

              <div>
                <label
                  htmlFor="decisionMode"
                  className="text-sm font-medium text-slate-700"
                >
                  Decision Mode
                </label>

                <select
                  id="decisionMode"
                  value={decisionMode}
                  onChange={(event) =>
                    setDecisionMode(
                      event.target.value as "AUTO" | "MANUAL_REVIEW",
                    )
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900"
                >
                  <option value="AUTO">AUTO</option>
                  <option value="MANUAL_REVIEW">MANUAL REVIEW</option>
                </select>
              </div>
            </div>

            <label
              htmlFor="changeReason"
              className="mt-5 block text-sm font-medium text-slate-700"
            >
              Change Reason
            </label>

            <textarea
              id="changeReason"
              value={changeReason}
              onChange={(event) => setChangeReason(event.target.value)}
              placeholder="Explain why this configuration change is needed..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!changeReason.trim()}
                onClick={handleCreateChange}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create Change
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}