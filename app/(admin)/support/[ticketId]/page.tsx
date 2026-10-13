"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  supportRecords,
  SupportPriority,
  SupportStatus,
} from "../supportData";

type SupportAction = "Resolve" | "Escalate";

function getStatusClasses(status: SupportStatus) {
  if (status === "Open") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "In Progress") {
    return "bg-amber-100 text-amber-700";
  }

  if (status === "Resolved") {
    return "bg-green-100 text-green-700";
  }

  return "bg-red-100 text-red-700";
}

function getPriorityClasses(priority: SupportPriority) {
  if (priority === "High") {
    return "bg-red-100 text-red-700";
  }

  if (priority === "Medium") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function SupportDetailPage() {
  const params = useParams();

  const ticketId = Array.isArray(params.ticketId)
    ? params.ticketId[0]
    : params.ticketId;

  const [selectedAction, setSelectedAction] =
    useState<SupportAction | null>(null);

  const [reason, setReason] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const ticket = useMemo(
    () =>
      supportRecords.find(
        (record) =>
          record.ticketId.toLowerCase() === ticketId?.toLowerCase()
      ),
    [ticketId]
  );

  if (!ticket) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-950">
              Support ticket not found
            </h1>

            <p className="mt-3 text-slate-600">
              The support ticket you are trying to review does not exist in
              the current support data.
            </p>

            <Link
              href="/support"
              className="mt-6 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Back to Support Queue
            </Link>
          </div>
        </div>
      </main>
    );
  }

  function openAction(action: SupportAction) {
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
      `${selectedAction} recorded for ${ticketId}.`
    );

    setSelectedAction(null);
    setReason("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Back */}
        <Link
          href="/support"
          className="mb-6 inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-950"
        >
          ← Back to Support Queue
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Support Ticket
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                {ticket.ticketId}
              </h1>

              <p className="mt-3 text-lg text-slate-600">
                {ticket.subject}
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(
                  ticket.status
                )}`}
              >
                {ticket.status}
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                {ticket.state}
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
                Support Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Every consequential action requires a reason.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openAction("Resolve")}
                className="rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
              >
                Resolve
              </button>

              <button
                type="button"
                onClick={() => openAction("Escalate")}
                className="rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
              >
                Escalate
              </button>
            </div>
          </div>
        </section>

        {/* Ticket Overview */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-slate-950">
              Ticket Overview
            </h2>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">Ticket ID</p>
              <p className="mt-1 font-semibold text-slate-950">
                {ticket.ticketId}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Category</p>
              <p className="mt-1 font-semibold text-slate-950">
                {ticket.category}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Priority</p>

              <span
                className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                  ticket.priority
                )}`}
              >
                {ticket.priority}
              </span>
            </div>

            <div>
              <p className="text-sm text-slate-500">Current State</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-950">
                {ticket.state}
              </p>
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <p className="text-sm text-slate-500">Subject</p>
              <p className="mt-1 font-semibold text-slate-950">
                {ticket.subject}
              </p>
            </div>
          </div>
        </section>

        {/* Customer & Assignment */}
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
                  {ticket.customerName}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Customer ID</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {ticket.customerId}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Created</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {ticket.createdAt}
                </p>
              </div>
            </div>
          </section>

          {/* Assignment Information */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-semibold text-slate-950">
                Assignment
              </h2>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm text-slate-500">Assigned To</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {ticket.assignedTo}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Last Updated</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {ticket.lastUpdated}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Status</p>

                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Customer Request */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-slate-950">
              Customer Request
            </h2>
          </div>

          <div className="p-6">
            <p className="text-sm font-semibold text-slate-500">
              Description
            </p>

            <p className="mt-2 leading-7 text-slate-700">
              {ticket.description}
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
                  {selectedAction} Ticket
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
                htmlFor="support-reason"
                className="block text-sm font-semibold text-slate-700"
              >
                Reason
              </label>

              <textarea
                id="support-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder={`Enter the reason for ${selectedAction.toLowerCase()}ing this ticket...`}
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