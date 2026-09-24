import Link from "next/link";
import { notFound } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: "Active" | "Suspended";
  joinedDate: string;
  address: string;
  totalLoans: number;
  outstandingAmount: number;
};

const customers: Customer[] = [
  {
    id: "CUST-1001",
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    status: "Active",
    joinedDate: "12 January 2025",
    address: "Raipur, Chhattisgarh",
    totalLoans: 2,
    outstandingAmount: 42500,
  },
  {
    id: "CUST-1002",
    name: "Priya Singh",
    phone: "9123456780",
    email: "priya.singh@example.com",
    status: "Active",
    joinedDate: "28 February 2025",
    address: "Bhilai, Chhattisgarh",
    totalLoans: 1,
    outstandingAmount: 18000,
  },
  {
    id: "CUST-1003",
    name: "Amit Kumar",
    phone: "9988776655",
    email: "amit.kumar@example.com",
    status: "Suspended",
    joinedDate: "7 March 2025",
    address: "Durg, Chhattisgarh",
    totalLoans: 3,
    outstandingAmount: 76200,
  },
  {
    id: "CUST-1004",
    name: "Neha Verma",
    phone: "9012345678",
    email: "neha.verma@example.com",
    status: "Active",
    joinedDate: "19 April 2025",
    address: "Korba, Chhattisgarh",
    totalLoans: 1,
    outstandingAmount: 250000,
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;

  const customer = customers.find(
    (item) => item.id.toLowerCase() === customerId.toLowerCase(),
  );

  if (!customer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/customers"
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to Customers
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Customer ID: {customer.id}
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              {customer.name}
            </h1>

            <p className="mt-2 text-slate-600">
              Customer profile and account information.
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              customer.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {customer.status}
          </span>
        </div>

        {/* Contact information */}
        <section className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Customer Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Basic customer details.
            </p>
          </div>

          <dl className="grid gap-6 px-6 py-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">
                Full Name
              </dt>
              <dd className="mt-1 text-base text-slate-950">
                {customer.name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Customer ID
              </dt>
              <dd className="mt-1 text-base text-slate-950">
                {customer.id}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Phone</dt>
              <dd className="mt-1 text-base text-slate-950">
                <a
                  href={`tel:${customer.phone}`}
                  className="hover:text-slate-700"
                >
                  {customer.phone}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd className="mt-1 text-base text-slate-950">
                <a
                  href={`mailto:${customer.email}`}
                  className="hover:text-slate-700"
                >
                  {customer.email}
                </a>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">
                Joined Date
              </dt>
              <dd className="mt-1 text-base text-slate-950">
                {formatDate(customer.joinedDate)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-slate-500">Address</dt>
              <dd className="mt-1 text-base text-slate-950">
                {customer.address}
              </dd>
            </div>
          </dl>
        </section>

        {/* Account overview */}
        <section className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Account Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Summary of the customer&apos;s lending activity.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Account Status
              </p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {customer.status}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Total Loans
              </p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {customer.totalLoans}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Outstanding Amount
              </p>

              <p className="mt-2 text-xl font-bold text-slate-950">
                {formatCurrency(customer.outstandingAmount)}
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Available customer actions will be connected to the backend
              later.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 p-6">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
            >
              View Loans — Coming soon
            </button>

            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
            >
              View Payments — Coming soon
            </button>

            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
            >
              View Activity — Coming soon
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}