import Link from "next/link";

export default function KycNotFound() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/kyc"
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to KYC Queue
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">
            KYC submission not found
          </h1>

          <p className="mt-3 text-slate-600">
            The KYC submission you are looking for does not exist.
          </p>

          <Link
            href="/kyc"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Back to KYC Queue
          </Link>
        </div>
      </div>
    </main>
  );
}