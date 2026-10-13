"use client";

import Link from "next/link";
import { use, useState } from "react";
import { complaints } from "../complaintsData";

type PageProps = {
  params: Promise<{
    complaintId: string;
  }>;
};

export default function ComplaintDetailPage({ params }: PageProps) {
  const { complaintId } = use(params);

  const [action, setAction] = useState<
    "ASSIGN" | "REPLY" | "RESOLVE" | "ESCALATE" | null
  >(null);

  const [reason, setReason] = useState("");

  const complaint = complaints.find(
    (item) => item.id === complaintId,
  );

  const closeModal = () => {
    setAction(null);
    setReason("");
  };

  const handleAction = () => {
    if (!reason.trim()) {
      return;
    }

    closeModal();
  };

  if (!complaint) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-slate-500">
            Customer Support
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Complaint not found
          </h1>

          <p className="mt-2 text-slate-600">
            The requested complaint does not exist.
          </p>

          <Link
            href="/complaints"
            className="mt-6 inline-block text-sm font-medium text-slate-700 hover:text-slate-950"
          >
            ← Back to Complaints
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/complaints"
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to Complaints
        </Link>

        <div className="mb-8 mt-6">
          <p className="text-sm font-medium text-slate-500">
            Customer Support
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {complaint.id}
              </h1>

              <p className="mt-2 text-slate-600">
                Complaint details and review actions.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {complaint.status.replace("_", " ")}
            </span>
          </div>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">
            Complaint Details
          </h2>

          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-slate-500">Customer</dt>
              <dd className="mt-1 font-medium">
                {complaint.customer}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-slate-500">Category</dt>
              <dd className="mt-1 font-medium">
                {complaint.category}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-slate-500">Priority</dt>
              <dd className="mt-1 font-medium">
                {complaint.priority}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-slate-500">
                Escalation Level
              </dt>
              <dd className="mt-1 font-medium">
                {complaint.escalationLevel.replace("_", " ")}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-slate-500">
                Assigned To
              </dt>
              <dd className="mt-1 font-medium">
                {complaint.assignedTo}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-slate-500">Created</dt>
              <dd className="mt-1 font-medium">
                {complaint.createdAt}
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-500">
              Subject
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {complaint.subject}
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Actions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Actions are mocked until the backend complaint workflow
            is available.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setAction("ASSIGN")}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Assign
            </button>

            <button
              type="button"
              onClick={() => setAction("REPLY")}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reply
            </button>

            <button
              type="button"
              disabled={complaint.status === "RESOLVED"}
              onClick={() => setAction("RESOLVE")}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Resolve
            </button>

            <button
              type="button"
              disabled={complaint.status === "ESCALATED"}
              onClick={() => setAction("ESCALATE")}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Escalate
            </button>
          </div>
        </section>
      </div>

      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">
              {action === "ASSIGN" && "Assign Complaint"}
              {action === "REPLY" && "Reply to Complaint"}
              {action === "RESOLVE" && "Resolve Complaint"}
              {action === "ESCALATE" && "Escalate Complaint"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {action === "ASSIGN"
                ? "Enter the team or admin user to assign this complaint to."
                : action === "REPLY"
                  ? "Enter the response that should be sent to the customer."
                  : action === "RESOLVE"
                    ? "Enter the resolution notes for this complaint."
                    : "Enter the reason for escalating this complaint."}
            </p>

            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={5}
              placeholder={
                action === "ASSIGN"
                  ? "Enter assignee..."
                  : action === "REPLY"
                    ? "Enter reply..."
                    : "Enter reason or notes..."
              }
              className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!reason.trim()}
                onClick={handleAction}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}