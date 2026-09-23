"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

type KycRecord = {
  kycId: string;
  customerId: string;
  customerName: string;
  document: string;
  documentNumber: string;
  provider: string;
  status: "Manual Review" | "Pending Provider" | "Verified";
  flag: string;
  submitted: string;
  verificationAttempts: number;
};

const demoKycRecords: KycRecord[] = [
  {
    kycId: "KYC-1001",
    customerId: "CUST-1001",
    customerName: "Rahul Sharma",
    document: "Aadhaar",
    documentNumber: "XXXX XXXX 4521",
    provider: "DigiLocker",
    status: "Manual Review",
    flag: "Name mismatch",
    submitted: "24 Sep 2026, 09:42 AM",
    verificationAttempts: 2,
  },
  {
    kycId: "KYC-1002",
    customerId: "CUST-1002",
    customerName: "Priya Singh",
    document: "PAN",
    documentNumber: "XXXXX1234X",
    provider: "External KYC Provider",
    status: "Manual Review",
    flag: "Document unclear",
    submitted: "24 Sep 2026, 10:15 AM",
    verificationAttempts: 1,
  },
  {
    kycId: "KYC-1003",
    customerId: "CUST-1003",
    customerName: "Amit Kumar",
    document: "Aadhaar",
    documentNumber: "XXXX XXXX 7824",
    provider: "DigiLocker",
    status: "Pending Provider",
    flag: "Awaiting verification",
    submitted: "24 Sep 2026, 11:08 AM",
    verificationAttempts: 1,
  },
  {
    kycId: "KYC-1004",
    customerId: "CUST-1004",
    customerName: "Neha Verma",
    document: "PAN",
    documentNumber: "XXXXX5678P",
    provider: "External KYC Provider",
    status: "Manual Review",
    flag: "DOB mismatch",
    submitted: "24 Sep 2026, 11:37 AM",
    verificationAttempts: 2,
  },
];

export default function KycDetailPage() {
  const params = useParams();

  const kycId = Array.isArray(params.kycId)
    ? params.kycId[0]
    : params.kycId;

  const kycRecord = useMemo(
    () => demoKycRecords.find((record) => record.kycId === kycId),
    [kycId]
  );

  if (!kycRecord) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-950">
              KYC submission not found
            </h1>

            <p className="mt-3 text-slate-600">
              The KYC submission you are looking for does not exist in the
              current demo data.
            </p>

            <Link
              href="/kyc"
              className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Back to KYC Queue
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const statusClasses =
    kycRecord.status === "Manual Review"
      ? "bg-amber-100 text-amber-700"
      : kycRecord.status === "Pending Provider"
        ? "bg-blue-100 text-blue-700"
        : "bg-green-100 text-green-700";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Back navigation */}
        <Link
          href="/kyc"
          className="mb-6 inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-950"
        >
          ← Back to KYC Queue
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              KYC Review
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              {kycRecord.kycId}
            </h1>

            <p className="mt-2 text-lg text-slate-600">
              Review KYC information and verification status.
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${statusClasses}`}
          >
            {kycRecord.status}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main information */}
          <div className="space-y-6 lg:col-span-2">
            {/* Customer information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Customer Information
              </h2>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Customer ID</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {kycRecord.customerId}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Customer Name</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {kycRecord.customerName}
                  </p>
                </div>
              </div>
            </section>

            {/* KYC information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                KYC Information
              </h2>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Document Type</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {kycRecord.document}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Document Number</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {kycRecord.documentNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Verification Provider</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {kycRecord.provider}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Verification Attempts
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {kycRecord.verificationAttempts}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Submitted</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {kycRecord.submitted}
                  </p>
                </div>
              </div>
            </section>

            {/* Review flag */}
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-7">
              <h2 className="text-xl font-bold text-slate-950">
                Review Flag
              </h2>

              <p className="mt-3 text-slate-700">
                This submission requires attention because of:
              </p>

              <div className="mt-4 rounded-xl border border-amber-200 bg-white px-5 py-4">
                <p className="font-semibold text-amber-800">
                  {kycRecord.flag}
                </p>
              </div>
            </section>
          </div>

          {/* Review actions */}
          <aside>
            <section className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Review Actions
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                These actions are placeholders for now. Real approval,
                rejection, and re-verification will be connected to the
                backend later.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  className="w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                >
                  Approve KYC
                </button>

                <button
                  type="button"
                  className="w-full rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-700 transition hover:bg-red-50"
                >
                  Reject KYC
                </button>

                <button
                  type="button"
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Request Re-verification
                </button>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <p className="text-xs leading-5 text-slate-500">
                  Demo actions only. Consequential actions will require a
                  reason and audit event when connected to the backend.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}