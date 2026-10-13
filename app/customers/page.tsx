"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, DataTable, type Column, PageHeader, Person, SearchField, Segmented, StatusBadge, TableFooter, Toolbar } from "@/components/ui";
import { customers, loans, type Customer } from "@/lib/mock";
import { fmtDate, inr } from "@/lib/format";

type Filter = "all" | "ACTIVE" | "SUSPENDED" | "KYC";

function List() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [filter, setFilter] = useState<Filter>("all");

  const outstanding = (id: string) => loans.filter((l) => l.customerId === id).reduce((s, l) => s + l.outstanding, 0);
  const loanCount = (id: string) => loans.filter((l) => l.customerId === id).length;

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return customers
      .filter((c) => (filter === "all" ? true : filter === "KYC" ? c.kyc !== "VERIFIED" : c.status === filter))
      .filter((c) => !term || [c.name, c.id, c.phone, c.email, c.city].some((v) => v.toLowerCase().includes(term)));
  }, [q, filter]);

  const columns: Column<Customer>[] = [
    { key: "name", header: "Customer", minWidth: 230, render: (c) => <Person name={c.name} sub={c.id} /> },
    { key: "phone", header: "Phone", render: (c) => <span className="num whitespace-nowrap text-sm">{c.phone}</span> },
    { key: "city", header: "City", render: (c) => c.city },
    { key: "kyc", header: "KYC", render: (c) => <StatusBadge status={c.kyc} /> },
    { key: "level", header: "Level", render: (c) => <span className="font-medium text-ink">{c.level}</span> },
    { key: "loans", header: "Loans", align: "right", render: (c) => <span className="num">{loanCount(c.id)}</span> },
    { key: "out", header: "Outstanding", align: "right", render: (c) => <span className="num">{outstanding(c.id) ? inr(outstanding(c.id)) : "—"}</span> },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "joined", header: "Joined", render: (c) => <span className="whitespace-nowrap text-muted">{fmtDate(c.joined)}</span> },
  ];

  return (
    <>
      <PageHeader title="Customers" description="Phone numbers and PAN are masked. Full identity data needs a separate permission and is logged." />
      <Card flush>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search name, phone, email or ID" />
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: customers.length },
              { value: "ACTIVE", label: "Active", count: customers.filter((c) => c.status === "ACTIVE").length },
              { value: "SUSPENDED", label: "Suspended", count: customers.filter((c) => c.status === "SUSPENDED").length },
              { value: "KYC", label: "KYC incomplete", count: customers.filter((c) => c.kyc !== "VERIFIED").length },
            ]}
          />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} rowHref={(c) => `/customers/${c.id}`} />
        <TableFooter shown={rows.length} total={customers.length} noun="customers" />
      </Card>
    </>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <List />
    </Suspense>
  );
}
