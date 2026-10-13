"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  applicationRecords,
  ApplicationStatus,
} from "../applicationData";

type ReviewAction = "Approve" | "Reject" | "Escalate";

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

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function ApplicationDetailPage() {
  const params = useParams();

  const applicationId = Array.isArray(params.applicationId)
    ? params.applicationId[0]
    : params.applicationId;

  const [selectedAction, setSelectedAction] =
    useState<ReviewAction | null>(null);

  const [reason, setReason] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const application = useMemo(
    () =>
      applicationRecords.find(
        (record) =>
          record.applicationId.toLowerCase() ===
          applicationId?.toLowerCase()
      ),
    [applicationId]
  );

  if (!application) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-950">
              Application not found
            </h1>

            <p className="mt-3 text-slate-600">
              The application you are trying to review does not exist in the
              current review data.
            </p>

            <Link
              href="/applications"
              className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Back to Applications
            </Link>
          </div>
        </div>
      </main>
    );
  }

  function openAction(action: ReviewAction) {
    setSelectedAction(action);
    setReason("");
    setActionMessage("");
  }

  function closeAction() {
    setSelectedAction(null);
    setReason("");
  }

  function handleAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      return;
    }

    setActionMessage(
      `${selectedAction} recorded for ${applicationId}.`
    );

    setSelectedAction(null);
    setReason("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <Link
          href="/applications"
          className="mb-6 inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-950"
        >
          ← Back to Application Queue
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Application Review
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                {application.applicationId}
              </h1>

              <p className="mt-3 text-lg text-slate-600">
                Review application submitted by {application.customerName}.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(
                  application.status
                )}`}
              >
                {application.status}
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                {application.state}
              </span>
            </div>
          </div>
        </div>

        {/* Action Success Message */}
        {actionMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            {actionMessage}
          </div>
        )}

        {/* Action Area */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Review Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Every consequential action requires a review reason.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openAction("Approve")}
                className="rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Approve
              </button>

              <button
                type="button"
                onClick={() => openAction("Reject")}
                className="rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
              >
                Reject
              </button>

              <button
                type="button"
                onClick={() => openAction("Escalate")}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Escalate
              </button>
            </div>
          </div>
        </section>

        {/* Application Overview */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-slate-950">
              Application Overview
            </h2>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">Application ID</p>
              <p className="mt-1 font-semibold text-slate-950">
                {application.applicationId}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Customer ID</p>
              <p className="mt-1 font-semibold text-slate-950">
                {application.customerId}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Loan Type</p>
              <p className="mt-1 font-semibold text-slate-950">
                {application.loanType}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Requested Amount</p>
              <p className="mt-1 font-semibold text-slate-950">
                {formatCurrency(application.requestedAmount)}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Tenure</p>
              <p className="mt-1 font-semibold text-slate-950">
                {application.tenureMonths} months
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Purpose</p>
              <p className="mt-1 font-semibold text-slate-950">
                {application.purpose}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Submitted</p>
              <p className="mt-1 font-semibold text-slate-950">
                {application.submitted}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Current State</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-950">
                {application.state}
              </p>
            </div>
          </div>
        </section>

        {/* Customer & Financial Information */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Customer Information */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-semibold text-slate-950">
                Customer Information
              </h2>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm text-slate-500">Customer Name</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {application.customerName}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Customer ID</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {application.customerId}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Employment Type</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {application.employmentType}
                </p>
              </div>
            </div>
          </section>

          {/* Financial Information */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-semibold text-slate-950">
                Financial Information
              </h2>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm text-slate-500">Monthly Income</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {formatCurrency(application.monthlyIncome)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Existing EMI</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {formatCurrency(application.existingEmi)}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Requested Amount</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {formatCurrency(application.requestedAmount)}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Review Information */}
        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 shadow-sm">
          <div className="border-b border-amber-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-slate-950">
              Review Information
            </h2>
          </div>

          <div className="p-6">
            <p className="text-sm font-semibold text-slate-700">
              Review flag
            </p>

            <p className="mt-2 text-slate-700">
              {application.reviewFlag}
            </p>
          </div>
        </section>
      </div>

      {/* Action Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  {selectedAction} Application
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Enter a reason before recording this action.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAction}
                className="text-2xl text-slate-400 hover:text-slate-700"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAction} className="mt-6">
              <label
                htmlFor="review-reason"
                className="block text-sm font-semibold text-slate-700"
              >
                Reason
              </label>

              <textarea
                id="review-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder={`Enter the reason for ${selectedAction.toLowerCase()}ing this application...`}
                rows={5}
                required
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAction}
                  className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Confirm {selectedAction}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}