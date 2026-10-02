import Link from "next/link";
import { disbursements } from "../disbursementData";

type PageProps = {
  params: Promise<{
    disbursementId: string;
  }>;
};

export default async function DisbursementDetailPage({
  params,
}: PageProps) {
  const { disbursementId } = await params;

  const disbursement = disbursements.find(
    (item) => item.id === disbursementId,
  );

  if (!disbursement) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-slate-500">
            Loans & Payments
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Disbursement not found
          </h1>

          <p className="mt-2 text-slate-600">
            The requested disbursement record does not exist.
          </p>

          <Link
            href="/disbursements"
            className="mt-6 inline-block text-sm font-medium text-slate-700 hover:text-slate-950"
          >
            ← Back to Disbursement Monitoring
          </Link>
        </div>
      </main>
    );
  }

  const canRetry =
    disbursement.status === "FAILED" ||
    disbursement.status === "REQUIRES_REVIEW";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/disbursements"
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to Disbursement Monitoring
        </Link>

        <div className="mb-8 mt-6">
          <p className="text-sm font-medium text-slate-500">
            Loans & Payments
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {disbursement.id}
              </h1>

              <p className="mt-2 text-slate-600">
                Disbursement for loan {disbursement.loanId}.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {disbursement.status}
            </span>
          </div>
        </div>

        <section className="grid gap-6 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Customer
            </p>

            <p className="mt-2 text-xl font-semibold">
              {disbursement.customer}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Loan
            </p>

            <p className="mt-2 text-xl font-semibold">
              {disbursement.loanId}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Amount
            </p>

            <p className="mt-2 text-2xl font-semibold">
              ₹{disbursement.amount.toLocaleString("en-IN")}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Created
            </p>

            <p className="mt-2 text-lg font-semibold">
              {disbursement.createdAt}
            </p>
          </article>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Actions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Retry is available for failed or review-required disbursements.
          </p>

          {canRetry ? (
            <div className="mt-5">
              <button
                type="button"
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Retry Disbursement
              </button>

              <p className="mt-2 text-xs text-slate-500">
                Mock action — backend integration will be added when the
                disbursement API is available.
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              No action is currently required.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}