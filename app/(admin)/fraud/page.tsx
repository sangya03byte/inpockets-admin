"use client";

import { useMemo, useState } from "react";
import { Card, DataTable, type Column, PageHeader, Person, SearchField, Segmented, StatusBadge, TableFooter, Toolbar } from "@/components/ui";
import { customerName, fraudCases, type FraudCase } from "@/lib/mock";
import { fmtDateTime } from "@/lib/format";

type Filter = "all" | "MANUAL_REVIEW" | "ESCALATED" | "CLEARED";

export default function FraudPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return fraudCases
      .filter((f) => filter === "all" || f.state === filter)
      .filter((f) => !term || f.id.toLowerCase().includes(term) || f.applicationId.toLowerCase().includes(term) || f.deviceId.toLowerCase().includes(term) || customerName(f.customerId).toLowerCase().includes(term));
  }, [q, filter]);

  const columns: Column<FraudCase>[] = [
    { key: "id", header: "Case", render: (f) => <span className="num font-medium text-ink">{f.id}</span> },
    { key: "cus", header: "Customer", minWidth: 200, render: (f) => <Person name={customerName(f.customerId)} sub={f.applicationId} /> },
    { key: "band", header: "Risk", render: (f) => <StatusBadge status={f.band} /> },
    { key: "sig", header: "Top signal", minWidth: 320, render: (f) => <span className="block truncate text-sm text-body" title={f.signals.join("; ")}>{f.signals[0]}{f.signals.length > 1 && <span className="text-faint"> +{f.signals.length - 1} more</span>}</span> },
    { key: "dev", header: "Device", render: (f) => <span className="num text-sm text-muted">{f.deviceId}</span> },
    { key: "state", header: "Status", render: (f) => <StatusBadge status={f.state} /> },
    { key: "at", header: "Raised", render: (f) => <span className="whitespace-nowrap text-muted">{fmtDateTime(f.raised)}</span> },
  ];

  const count = (f: Filter) => (f === "all" ? fraudCases.length : fraudCases.filter((c) => c.state === f).length);

  return (
    <>
      <PageHeader title="Fraud review" description="Signals raised by the fraud and device checks. A signal is a reason to look, not a verdict." />
      <Card flush>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search case, customer, device or application" />
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: count("all") },
              { value: "MANUAL_REVIEW", label: "Manual review", count: count("MANUAL_REVIEW") },
              { value: "ESCALATED", label: "Escalated", count: count("ESCALATED") },
              { value: "CLEARED", label: "Cleared", count: count("CLEARED") },
            ]}
          />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(f) => f.id} rowHref={(f) => `/fraud/${f.id}`} />
        <TableFooter shown={rows.length} total={fraudCases.length} noun="cases" />
      </Card>
    </>
  );
}
