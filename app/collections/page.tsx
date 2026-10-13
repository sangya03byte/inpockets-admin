"use client";

import { useMemo, useState } from "react";
import { Card, DataTable, type Column, PageHeader, Person, SearchField, Segmented, StatusBadge, TableFooter, Toolbar, Stat, Grid } from "@/components/ui";
import { collectionCases, customerName, type CollectionCase } from "@/lib/mock";
import { fmtDate, inr } from "@/lib/format";

type Filter = "all" | CollectionCase["stage"];

const bucket = (dpd: number) => (dpd === 0 ? "Current" : dpd <= 7 ? "1–7 days" : dpd <= 30 ? "8–30 days" : dpd <= 60 ? "31–60 days" : "60+ days");

export default function CollectionsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return collectionCases
      .filter((c) => filter === "all" || c.stage === filter)
      .filter((c) => !term || c.id.toLowerCase().includes(term) || c.loanId.toLowerCase().includes(term) || customerName(c.customerId).toLowerCase().includes(term));
  }, [q, filter]);

  const overdue = collectionCases.filter((c) => c.dpd > 0);

  const columns: Column<CollectionCase>[] = [
    { key: "id", header: "Case", render: (c) => <span className="num font-medium text-ink">{c.id}</span> },
    { key: "cus", header: "Customer", minWidth: 200, render: (c) => <Person name={customerName(c.customerId)} sub={c.loanId} /> },
    { key: "o", header: "Overdue", align: "right", render: (c) => <span className="num font-medium text-ink">{c.overdue ? inr(c.overdue) : "—"}</span> },
    { key: "dpd", header: "Days past due", render: (c) => (<div><span className={`num ${c.dpd > 30 ? "font-medium text-bad" : "text-body"}`}>{c.dpd || "—"}</span><span className="ml-2 text-xs text-muted">{bucket(c.dpd)}</span></div>) },
    { key: "stage", header: "Stage", render: (c) => <StatusBadge status={c.stage} /> },
    { key: "agent", header: "Agent", render: (c) => c.agent },
    { key: "last", header: "Last contact", render: (c) => <span className="whitespace-nowrap text-muted">{fmtDate(c.lastContact)}</span> },
    { key: "ptp", header: "Promise date", render: (c) => <span className="whitespace-nowrap text-muted">{fmtDate(c.promiseDate)}</span> },
  ];

  const count = (f: Filter) => (f === "all" ? collectionCases.length : collectionCases.filter((c) => c.stage === f).length);

  return (
    <>
      <PageHeader title="Collections" description="Respectful, auditable follow-up on overdue loans. Every contact is logged." />
      <Grid cols={3} className="mb-6">
        <Stat label="Cases past due" value={overdue.length} tone="bad" />
        <Stat label="Overdue amount" value={inr(overdue.reduce((s, c) => s + c.overdue, 0))} />
        <Stat label="Promises to pay" value={collectionCases.filter((c) => c.stage === "PROMISE_TO_PAY").length} hint="Check on the promised date" />
      </Grid>
      <Card flush>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search case, loan or customer" />
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: count("all") },
              { value: "REMINDER", label: "Reminder", count: count("REMINDER") },
              { value: "FOLLOW_UP", label: "Follow-up", count: count("FOLLOW_UP") },
              { value: "PROMISE_TO_PAY", label: "Promise to pay", count: count("PROMISE_TO_PAY") },
              { value: "ESCALATED", label: "Escalated", count: count("ESCALATED") },
            ]}
          />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} rowHref={(c) => `/collections/${c.id}`} />
        <TableFooter shown={rows.length} total={collectionCases.length} noun="cases" />
      </Card>
    </>
  );
}
