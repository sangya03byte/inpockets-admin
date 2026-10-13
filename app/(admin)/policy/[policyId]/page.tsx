"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { policyRecords, PolicyStatus } from "../policyData";

const statusClasses: Record<PolicyStatus, string> = {
  Active: "bg-green-50 text-green-700",
  Draft: "bg-yellow-50 text-yellow-700",
  Archived: "bg-gray-100 text-gray-600",
};

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();

  const policyId = params.policyId as string;

  const policy = policyRecords.find(
    (record) => record.policyId === policyId
  );

  const [displayStatus, setDisplayStatus] = useState<PolicyStatus>(
    policy?.status ?? "Draft"
  );

  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<"activate" | "archive" | null>(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  if (!policy) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Policy not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The requested policy could not be found.
          </p>

          <button
            type="button"
            onClick={() => router.push("/policy")}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to Policies
          </button>
        </div>
      </main>
    );
  }

  const openActionModal = (selectedAction: "activate" | "archive") => {
    setAction(selectedAction);
    setReason("");
    setMessage("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setAction(null);
    setReason("");
  };

  const submitAction = () => {
    if (!reason.trim() || !action) {
      return;
    }

    if (action === "activate") {
      setDisplayStatus("Active");
      setMessage(`Activation recorded for ${policy.policyId}.`);
    }

    if (action === "archive") {
      setDisplayStatus("Archived");
      setMessage(`Archive recorded for ${policy.policyId}.`);
    }

    closeModal();
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => router.push("/policy")}
          className="mb-5 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Policies
        </button>

        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {policy.policyId}
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              {policy.name}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              {policy.description}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${statusClasses[displayStatus]}`}
          >
            {displayStatus}
          </span>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Policy Information
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Category
                </p>
                <p className="mt-1 text-sm text-slate-900">
                  {policy.category}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Version
                </p>
                <p className="mt-1 text-sm text-slate-900">
                  {policy.version}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Effective Date
                </p>
                <p className="mt-1 text-sm text-slate-900">
                  {policy.effectiveDate}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Review Frequency
                </p>
                <p className="mt-1 text-sm text-slate-900">
                  {policy.reviewFrequency}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Last Updated
                </p>
                <p className="mt-1 text-sm text-slate-900">
                  {policy.lastUpdated}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Updated By
                </p>
                <p className="mt-1 text-sm text-slate-900">
                  {policy.updatedBy}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Configuration
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">
                  Minimum Loan Amount
                </span>

                <span className="text-sm font-medium text-slate-900">
                  ₹{policy.configuration.minLoanAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">
                  Maximum Loan Amount
                </span>

                <span className="text-sm font-medium text-slate-900">
                  ₹{policy.configuration.maxLoanAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">
                  Maximum Tenure
                </span>

                <span className="text-sm font-medium text-slate-900">
                  {policy.configuration.maxTenureMonths} months
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">
                  Minimum Income
                </span>

                <span className="text-sm font-medium text-slate-900">
                  ₹{policy.configuration.minIncome.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Maximum Existing EMI Ratio
                </span>

                <span className="text-sm font-medium text-slate-900">
                  {policy.configuration.maxExistingEmiRatio}%
                </span>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Policy Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Actions are recorded with a reason for audit purposes.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {displayStatus === "Draft" && (
              <button
                type="button"
                onClick={() => openActionModal("activate")}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Activate Policy
              </button>
            )}

            {displayStatus === "Active" && (
              <button
                type="button"
                onClick={() => openActionModal("archive")}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Archive Policy
              </button>
            )}

            {displayStatus === "Archived" && (
              <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-500">
                No actions available
              </span>
            )}
          </div>
        </section>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900">
                {action === "activate"
                  ? "Activate Policy"
                  : "Archive Policy"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Please provide a reason for this action.
              </p>

              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Enter reason..."
                rows={4}
                className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={submitAction}
                  disabled={!reason.trim()}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}