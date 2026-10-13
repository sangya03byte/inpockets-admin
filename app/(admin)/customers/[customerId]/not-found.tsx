import Link from "next/link";

export default function CustomerNotFound() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/customers"
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to Customers
        </Link>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold text-slate-950">
            Customer not found
          </h1>

          <p className="mt-2 text-slate-600">
            The requested customer could not be found.
          </p>

          <Link
            href="/customers"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Return to Customers
          </Link>
        </div>
      </div>
    </main>
  );
}