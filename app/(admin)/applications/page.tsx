"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card, DataTable, type Column, PageHeader, Person, SearchField, Segmented, StatusBadge, TableFooter, Toolbar, Badge,
} from "@/components/ui";
import { applications, customerName, type Application } from "@/lib/mock";
import { fmtDateTime, inr } from "@/lib/format";

type Filter = "all" | "review" | "provider" | "approved" | "rejected";

function matches(a: Application, f: Filter) {
  if (f === "review") return a.state === "MANUAL_REVIEW" || a.state === "PENDING_INFORMATION";
  if (f === "provider") return a.state === "PENDING_EXTERNAL_PROVIDER";
  if (f === "approved") return a.state === "APPROVED";
  if (f === "rejected") return a.state === "REJECTED";
  return true;
}

function Queue() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return applications
      .filter((a) => matches(a, filter))
      .filter((a) => !term || a.id.toLowerCase().includes(term) || customerName(a.customerId).toLowerCase().includes(term) || a.customerId.toLowerCase().includes(term))
      .sort((a, b) => b.submitted.localeCompare(a.submitted));
  }, [q, filter]);

  const columns: Column<Application>[] = [
    { key: "id", header: "Application", minWidth: 200, render: (a) => (<div className="min-w-0"><p className="num font-medium text-ink">{a.id}</p><p className="truncate text-xs text-muted" title={a.purpose}>{a.purpose}</p></div>) },
    { key: "cus", header: "Customer", minWidth: 190, render: (a) => <Person name={customerName(a.customerId)} sub={a.customerId} /> },
    { key: "req", header: "Requested", align: "right", render: (a) => <span className="num font-medium text-ink">{inr(a.requested)}</span> },
    { key: "elig", header: "Eligible", align: "right", render: (a) => (a.eligible > 0 ? <span className={`num ${a.eligible < a.requested ? "text-warn" : "text-body"}`}>{inr(a.eligible)}</span> : <span className="text-faint">—</span>) },
    { key: "risk", header: "Risk", render: (a) => (a.risk.band ? (<div className="flex items-center gap-2"><StatusBadge status={a.risk.band} /><span className="num text-xs text-muted">{a.risk.score}</span></div>) : <Badge tone="brand">Awaiting bureau</Badge>) },
    { key: "state", header: "Status", render: (a) => <StatusBadge status={a.state} /> },
    { key: "who", header: "Assigned to", render: (a) => <span className="text-sm text-body">{a.assignedTo}</span> },
    { key: "at", header: "Submitted", render: (a) => <span className="whitespace-nowrap text-sm text-muted">{fmtDateTime(a.submitted)}</span> },
  ];

  const count = (f: Filter) => applications.filter((a) => matches(a, f)).length;

  return (
    <>
      <PageHeader title="Applications" description="Every loan application, with the system's recommendation and the reviewer's decision." />
      <Card flush>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search by application, customer or ID" />
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: count("all") },
              { value: "review", label: "Needs review", count: count("review") },
              { value: "provider", label: "Pending provider", count: count("provider") },
              { value: "approved", label: "Approved", count: count("approved") },
              { value: "rejected", label: "Rejected", count: count("rejected") },
            ]}
          />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(a) => a.id} rowHref={(a) => `/applications/${a.id}`} />
        <TableFooter shown={rows.length} total={applications.length} noun="applications" />
      </Card>
    </>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={null}>
      <Queue />
    </Suspense>
  );
}
