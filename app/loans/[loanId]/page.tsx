import Link from "next/link";
import { loans } from "../loanData";

type PageProps = {
  params: Promise<{
    loanId: string;
  }>;
};

export default async function LoanDetailPage({ params }: PageProps) {
  const { loanId } = await params;
  const loan = loans.find((item) => item.id === loanId);

  if (!loan) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-slate-500">
            Loans & Payments
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Loan not found
          </h1>

          <p className="mt-2 text-slate-600">
            The requested loan record does not exist.
          </p>

          <Link
            href="/loans"
            className="mt-6 inline-block text-sm font-medium text-slate-700 hover:text-slate-950"
          >
            ← Back to Loan Monitoring
          </Link>
        </div>
      </main>
    );
  }

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            href="/loans"
            className="text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            ← Back to Loan Monitoring
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Loans & Payments
          </p>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {loan.id}
              </h1>

              <p className="mt-2 text-slate-600">
                Loan linked to application {loan.applicationId}.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {loan.status}
            </span>
          </div>
        </div>

        <section className="grid gap-6 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Customer
            </p>

            <p className="mt-2 text-xl font-semibold text-slate-950">
              {loan.customer}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Application: {loan.applicationId}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Loan Status
            </p>

            <p className="mt-2 text-xl font-semibold text-slate-950">
              {loan.status}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Disbursed Amount
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {formatAmount(loan.disbursedAmount)}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-medium text-slate-500">
              Outstanding Balance
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {formatAmount(loan.outstandingBalance)}
            </p>
          </article>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Repayment Information</h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Next Due Date
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {loan.nextDueDate}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Application
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {loan.applicationId}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}