"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Card, DataTable, PageHeader, Person, SearchField, StatusBadge, Toolbar, type Column } from "@/components/ui";
import { ErrorNote, Loading, PAGE_SIZE } from "@/components/live";
import { fmtDate, humanize } from "@/lib/format";
import type { Customer, CustomerList } from "@/lib/types";
import { useApi } from "@/lib/use-api";

function CustomersView() {
  const params = useSearchParams();
  const [term, setTerm] = useState(params.get("q") ?? "");
  const [page, setPage] = useState(1);
  const { data, error, loading } = useApi<CustomerList>(`admin/customers?page=${page}&page_size=${PAGE_SIZE}`);

  const t = term.trim().toLowerCase();
  const rows = (data?.items ?? []).filter((c) => !t || [c.first_name, c.last_name, c.phone_number, c.customer_id].some((v) => v?.toLowerCase().includes(t)));
  const columns: Column<Customer>[] = [
    { key: "n", header: "Customer", minWidth: 200, render: (c) => <Person name={[c.first_name, c.last_name].filter(Boolean).join(" ") || "Unnamed customer"} sub={c.phone_number} /> },
    { key: "s", header: "Account", render: (c) => <StatusBadge status={c.status} /> },
    { key: "o", header: "Onboarding", render: (c) => <span className="text-sm text-body">{c.onboarding_status ? humanize(c.onboarding_status) : "—"}</span> },
    { key: "p", header: "PAN", render: (c) => (c.pan_status ? <StatusBadge status={c.pan_status} /> : <span className="text-faint">—</span>) },
    { key: "k", header: "KYC", render: (c) => (c.kyc_status ? <StatusBadge status={c.kyc_status} /> : <span className="text-faint">—</span>) },
    { key: "d", header: "Joined", render: (c) => <span className="text-sm text-muted">{fmtDate(c.created_at)}</span> },
  ];
  const pages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  return (
    <>
      <PageHeader title="Customers" description="Everyone who has signed up in the mobile app." />
      <ErrorNote error={error} />
      <Card flush>
        <Toolbar><SearchField value={term} onChange={setTerm} placeholder="Filter this page by name or mobile number" /></Toolbar>
        {loading && !data ? <Loading what="customers" /> : <DataTable columns={columns} rows={rows} rowKey={(c) => c.customer_id} rowHref={(c) => `/customers/${c.customer_id}`} />}
        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-muted">
          <span>{data ? `${data.total} customer${data.total === 1 ? "" : "s"}` : ""}</span>
          <span className="flex items-center gap-2">
            <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <span>Page {page} of {pages}</span>
            <Button disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </span>
        </div>
      </Card>
    </>
  );
}

export default function CustomersPage() {
  return <Suspense fallback={null}><CustomersView /></Suspense>;
}
