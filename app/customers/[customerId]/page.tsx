"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: "Active" | "Suspended";
  joinedDate: string;
  address: string;
  totalLoans: number;
  outstandingAmount: string;
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
    outstandingAmount: "₹42,500",
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
    outstandingAmount: "₹18,000",
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
    outstandingAmount: "₹76,200",
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
    outstandingAmount: "₹25,000",
  },
];

export default function CustomerDetailPage() {
  const params = useParams<{ customerId: string }>();
  const customerId = params.customerId;

  const customer = customers.find(
    (item) => item.id.toLowerCase() === customerId?.toLowerCase(),
  );

  if (!customer) {
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
              No customer was found for ID{" "}
              <span className="font-medium text-slate-900">
                {customerId}
              </span>
              .
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

          <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-slate-500">Full Name</p>
              <p className="mt-1 text-base text-slate-950">
                {customer.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Customer ID
              </p>
              <p className="mt-1 text-base text-slate-950">
                {customer.id}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Phone</p>
              <p className="mt-1 text-base text-slate-950">
                {customer.phone}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <p className="mt-1 text-base text-slate-950">
                {customer.email}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Joined Date
              </p>
              <p className="mt-1 text-base text-slate-950">
                {customer.joinedDate}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Address</p>
              <p className="mt-1 text-base text-slate-950">
                {customer.address}
              </p>
            </div>
          </div>
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
                {customer.outstandingAmount}
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
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Loans
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Payments
            </button>

            <button
              type="button"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View Activity
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}