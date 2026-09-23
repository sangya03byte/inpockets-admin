"use client";

import { FormEvent, useMemo, useState } from "react";

type Customer = {
  id: string;
  name: string;
  phone: string;
  status: "Active" | "Suspended";
};

const customers: Customer[] = [
  {
    id: "CUST-1001",
    name: "Rahul Sharma",
    phone: "9876543210",
    status: "Active",
  },
  {
    id: "CUST-1002",
    name: "Priya Singh",
    phone: "9123456780",
    status: "Active",
  },
  {
    id: "CUST-1003",
    name: "Amit Kumar",
    phone: "9988776655",
    status: "Suspended",
  },
  {
    id: "CUST-1004",
    name: "Neha Verma",
    phone: "9012345678",
    status: "Active",
  },
];

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) {
      return customers;
    }

    const search = searchQuery.toLowerCase().trim();

    return customers.filter(
      (customer) =>
        customer.id.toLowerCase().includes(search) ||
        customer.name.toLowerCase().includes(search) ||
        customer.phone.includes(search)
    );
  }, [searchQuery]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    setTimeout(() => {
      setSearchQuery(query);
      setIsLoading(false);
    }, 400);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>

          <p className="mt-2 text-slate-600">
            Search customers by name, phone number, or customer ID.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, phone, or customer ID..."
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Results */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">
              Customer Results
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredCustomers.length} customer
              {filteredCustomers.length === 1 ? "" : "s"} found
            </p>
          </div>

          {isLoading ? (
            <div className="px-6 py-12 text-center text-slate-500">
              Loading customers...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-slate-900">
                No customers found.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try a different name, phone number, or customer ID.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Customer ID
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Name
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {customer.id}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {customer.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {customer.phone}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            customer.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {customer.status}
                        </span>
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