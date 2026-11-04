"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Card, DataTable, PageHeader, Person, SearchField, Segmented, StatusBadge, Toolbar, type Column } from "@/components/ui";
import { ErrorNote, Loading, PAGE_SIZE, money } from "@/components/live";
import { fmtDateTime } from "@/lib/format";
import type { Queue, QueueItem } from "@/lib/types";
import { useApi } from "@/lib/use-api";

type Filter = "open" | "approved" | "rejected" | "closed";
const STATUSES: Record<Filter, string[]> = {
  open: ["SUBMITTED", "PROCESSING", "MANUAL_REVIEW", "PENDING_ADDITIONAL_INFORMATION"],
  approved: ["APPROVED"],
  rejected: ["REJECTED"],
  closed: ["CANCELLED", "EXPIRED"],
};

function QueueView() {
  const params = useSearchParams();
  const [term, setTerm] = useState(params.get("q") ?? "");
  const [filter, setFilter] = useState<Filter>("open");
  const [page, setPage] = useState(1);

  const qs = [...STATUSES[filter].map((s) => `status=${s}`), `page=${page}`, `page_size=${PAGE_SIZE}`, ...(term.trim() ? [`q=${encodeURIComponent(term.trim())}`] : [])].join("&");
  const { data, error, loading } = useApi<Queue>(`admin/loan-applications/queue?${qs}`);

  const columns: Column<QueueItem>[] = [
    { key: "n", header: "Application", minWidth: 190, render: (a) => <span className="num font-medium text-ink">{a.application_number}</span> },
    { key: "c", header: "Customer", minWidth: 190, render: (a) => <Person name={a.customer_name ?? "Unnamed customer"} sub={a.phone_last4 ? `…${a.phone_last4}` : undefined} /> },
    { key: "r", header: "Requested", align: "right", render: (a) => <span className="num font-medium text-ink">{money(a.requested_amount)}</span> },
    { key: "t", header: "Tenure", render: (a) => <span className="num text-body">{a.requested_tenure_days} days</span> },
    { key: "s", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    { key: "at", header: "Submitted", render: (a) => <span className="whitespace-nowrap text-sm text-muted">{a.submitted_at ? fmtDateTime(a.submitted_at) : "Draft"}</span> },
  ];

  const pages = data ? Math.max(1, Math.ceil(data.total / data.page_size)) : 1;

  return (
    <>
      <PageHeader title="Applications" description="Every loan application, oldest first. Open one to review and decide." />
      <ErrorNote error={error} />
      <Card flush>
        <Toolbar>
          <SearchField value={term} onChange={(v) => { setTerm(v); setPage(1); }} placeholder="Application number or customer name" />
          <Segmented<Filter> value={filter} onChange={(f) => { setFilter(f); setPage(1); }} options={[
            { value: "open", label: "Open" }, { value: "approved", label: "Approved" }, { value: "rejected", label: "Rejected" }, { value: "closed", label: "Closed" },
          ]} />
        </Toolbar>
        {loading && !data ? <Loading what="applications" /> : <DataTable columns={columns} rows={data?.items ?? []} rowKey={(a) => a.id} rowHref={(a) => `/applications/${a.id}`} />}
        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-muted">
          <span>{data ? `${data.total} application${data.total === 1 ? "" : "s"}` : ""}</span>
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

export default function ApplicationsPage() {
  return <Suspense fallback={null}><QueueView /></Suspense>;
}
