"use client";

import { useMemo, useState } from "react";
import { Card, DataTable, type Column, PageHeader, Segmented, StatusBadge, TableFooter, Toolbar, Stat, Grid } from "@/components/ui";
import { reconciliations, type Reconciliation } from "@/lib/mock";
import { fmtDate, inr } from "@/lib/format";

type Filter = "all" | Reconciliation["status"];

export default function ReconciliationPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const rows = useMemo(() => reconciliations.filter((r) => filter === "all" || r.status === filter), [filter]);
  const count = (f: Filter) => (f === "all" ? reconciliations.length : reconciliations.filter((r) => r.status === f).length);

  const gap = (r: Reconciliation) => Math.max(Math.abs(r.ledger - r.provider), Math.abs(r.provider - r.bank));
  const unmatched = reconciliations.filter((r) => r.status === "MISMATCH");

  const columns: Column<Reconciliation>[] = [
    { key: "id", header: "Record", render: (r) => <span className="num font-medium text-ink">{r.id}</span> },
    { key: "txn", header: "Transaction", render: (r) => (<div><p className="num text-ink">{r.txnId}</p><p className="text-xs text-muted">{r.type === "DISBURSEMENT" ? "Payout" : "Repayment"}</p></div>) },
    { key: "l", header: "Our ledger", align: "right", render: (r) => <span className="num">{inr(r.ledger)}</span> },
    { key: "p", header: "Provider", align: "right", render: (r) => <span className="num">{inr(r.provider)}</span> },
    { key: "b", header: "Bank", align: "right", render: (r) => <span className="num">{inr(r.bank)}</span> },
    { key: "g", header: "Largest gap", align: "right", render: (r) => <span className={`num ${gap(r) ? "font-medium text-bad" : "text-faint"}`}>{gap(r) ? inr(gap(r)) : "—"}</span> },
    { key: "s", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "d", header: "Date", render: (r) => <span className="whitespace-nowrap text-muted">{fmtDate(r.date)}</span> },
  ];

  return (
    <>
      <PageHeader title="Reconciliation" description="Our ledger, the payment provider and the bank statement must agree on every transaction." />
      <Grid cols={3} className="mb-6">
        <Stat label="Matched" value={reconciliations.filter((r) => r.status === "MATCHED").length} tone="ok" hint="All three sources agree" />
        <Stat label="Breaks to investigate" value={unmatched.length} tone={unmatched.length ? "warn" : "ok"} hint={unmatched.length ? "Do not retry affected payouts" : "Nothing open"} />
        <Stat label="Value at risk" value={inr(unmatched.reduce((s, r) => s + gap(r), 0))} hint="Sum of largest gaps" />
      </Grid>
      <Card flush>
        <Toolbar>
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: count("all") },
              { value: "MISMATCH", label: "Mismatch", count: count("MISMATCH") },
              { value: "MATCHED", label: "Matched", count: count("MATCHED") },
              { value: "RESOLVED", label: "Resolved", count: count("RESOLVED") },
            ]}
          />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} rowHref={(r) => `/reconciliation/${r.id}`} />
        <TableFooter shown={rows.length} total={reconciliations.length} noun="records" />
      </Card>
    </>
  );
}
