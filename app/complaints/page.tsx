"use client";

import Link from "next/link";
import { useState } from "react";
import { complaints } from "./complaintsData";

export default function ComplaintsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [escalation, setEscalation] = useState("ALL");

  const query = search.trim().toLowerCase();

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      !query ||
      complaint.id.toLowerCase().includes(query) ||
      complaint.customer.toLowerCase().includes(query) ||
      complaint.subject.toLowerCase().includes(query) ||
      complaint.category.toLowerCase().includes(query);

    const matchesStatus =
      status === "ALL" || complaint.status === status;

    const matchesEscalation =
      escalation === "ALL" ||
      complaint.escalationLevel === escalation;

    return matchesSearch && matchesStatus && matchesEscalation;
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Customer Support
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Complaints
          </h1>

          <p className="mt-2 text-slate-600">
            Review customer complaints, escalations, and resolution status.
          </p>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Search
              </label>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID, customer, subject or category"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="ESCALATED">Escalated</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Escalation Level
              </label>

              <select
                value={escalation}
                onChange={(e) => setEscalation(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900"
              >
                <option value="ALL">All Levels</option>
                <option value="LEVEL_1">Level 1</option>
                <option value="LEVEL_2">Level 2</option>
                <option value="LEVEL_3">Level 3</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold">Complaint Queue</h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredComplaints.length} complaint
              {filteredComplaints.length === 1 ? "" : "s"} found.
            </p>
          </div>

          {filteredComplaints.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-medium text-slate-700">
                No complaints found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing the search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-5 py-3 text-sm font-semibold">
                      Complaint
                    </th>
                    <th className="px-5 py-3 text-sm font-semibold">
                      Customer
                    </th>
                    <th className="px-5 py-3 text-sm font-semibold">
                      Category
                    </th>
                    <th className="px-5 py-3 text-sm font-semibold">
                      Priority
                    </th>
                    <th className="px-5 py-3 text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-5 py-3 text-sm font-semibold">
                      Escalation
                    </th>
                    <th className="px-5 py-3 text-sm font-semibold">
                      Created
                    </th>
                    <th className="px-5 py-3 text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {complaint.id}
                        </p>

                        <p className="mt-1 max-w-xs text-sm text-slate-500">
                          {complaint.subject}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {complaint.customer}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {complaint.category}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                          {complaint.priority}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                          {complaint.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {complaint.escalationLevel.replace("_", " ")}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {complaint.createdAt}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/complaints/${complaint.id}`}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
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