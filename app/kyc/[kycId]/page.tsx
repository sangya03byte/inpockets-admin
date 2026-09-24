import Link from "next/link";
import { notFound } from "next/navigation";
import { kycRecords } from "../kycData";

type KycDetailPageProps = {
  params: Promise<{
    kycId: string;
  }>;
};

export default async function KycDetailPage({
  params,
}: KycDetailPageProps) {
  const { kycId } = await params;

  const kycRecord = kycRecords.find(
    (record) => record.kycId.toLowerCase() === kycId.toLowerCase(),
  );

  if (!kycRecord) {
    notFound();
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
            {/* Customer Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Customer Information
              </h2>

              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-slate-500">Customer ID</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {kycRecord.customerId}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">Customer Name</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {kycRecord.customerName}
                  </dd>
                </div>
              </dl>
            </section>

            {/* KYC Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                KYC Information
              </h2>

              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-slate-500">Document Type</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {kycRecord.document}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">
                    Document Number
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {kycRecord.documentNumber}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">
                    Verification Provider
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {kycRecord.provider}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">
                    Verification Attempts
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {kycRecord.verificationAttempts}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-slate-500">Submitted</dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {kycRecord.submitted}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Review Flag */}
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

          {/* Review Actions */}
          <aside>
            <section className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">
                Review Actions
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Review actions will be connected to the backend once the KYC
                review API is available.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-slate-200 px-5 py-3 font-semibold text-slate-500"
                >
                  Approve KYC
                </button>

                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 font-semibold text-slate-400"
                >
                  Reject KYC
                </button>

                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 font-semibold text-slate-400"
                >
                  Request Re-verification
                </button>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <p className="text-xs leading-5 text-slate-500">
                  These actions are intentionally disabled until backend
                  integration is available. Consequential actions will
                  require a reason and audit event.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}