"use client";

import { useMemo, useState } from "react";
import { Card, DataTable, type Column, PageHeader, Person, SearchField, Segmented, StatusBadge, TableFooter, Toolbar, Stat, Grid } from "@/components/ui";
import { customerName, loans, type Loan } from "@/lib/mock";
import { fmtDate, inr } from "@/lib/format";

type Filter = "all" | Loan["status"];

export default function LoansPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return loans
      .filter((l) => filter === "all" || l.status === filter)
      .filter((l) => !term || l.id.toLowerCase().includes(term) || customerName(l.customerId).toLowerCase().includes(term));
  }, [q, filter]);

  const book = loans.filter((l) => l.status === "ACTIVE" || l.status === "OVERDUE");
  const outstanding = book.reduce((s, l) => s + l.outstanding, 0);
  const overdue = loans.filter((l) => l.status === "OVERDUE");

  const columns: Column<Loan>[] = [
    { key: "id", header: "Loan", render: (l) => <span className="num font-medium text-ink">{l.id}</span> },
    { key: "cus", header: "Customer", minWidth: 200, render: (l) => <Person name={customerName(l.customerId)} sub={l.customerId} /> },
    { key: "lvl", header: "Level", render: (l) => l.level },
    { key: "p", header: "Principal", align: "right", render: (l) => <span className="num">{inr(l.principal)}</span> },
    { key: "o", header: "Outstanding", align: "right", render: (l) => <span className="num font-medium text-ink">{l.outstanding ? inr(l.outstanding) : "—"}</span> },
    { key: "due", header: "Next due", render: (l) => <span className="whitespace-nowrap text-muted">{fmtDate(l.nextDue)}</span> },
    { key: "dpd", header: "Days past due", align: "right", render: (l) => <span className={`num ${l.dpd > 0 ? "font-medium text-bad" : "text-faint"}`}>{l.dpd > 0 ? l.dpd : "—"}</span> },
    { key: "s", header: "Status", render: (l) => <StatusBadge status={l.status} /> },
  ];

  const count = (f: Filter) => (f === "all" ? loans.length : loans.filter((l) => l.status === f).length);

  return (
    <>
      <PageHeader title="Loans" description="Balances come from the ledger. A loan is only active after a confirmed disbursement." />
      <Grid cols={3} className="mb-6">
        <Stat label="Active book" value={book.length} hint="Loans with money outstanding" />
        <Stat label="Outstanding principal and interest" value={inr(outstanding)} />
        <Stat label="Overdue" value={overdue.length} hint={`${inr(overdue.reduce((s, l) => s + l.outstanding, 0))} outstanding`} tone="bad" />
      </Grid>
      <Card flush>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search loan or customer" />
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: count("all") },
              { value: "ACTIVE", label: "Active", count: count("ACTIVE") },
              { value: "OVERDUE", label: "Overdue", count: count("OVERDUE") },
              { value: "PENDING_DISBURSEMENT", label: "Pending payout", count: count("PENDING_DISBURSEMENT") },
              { value: "CLOSED", label: "Closed", count: count("CLOSED") },
            ]}
          />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(l) => l.id} rowHref={(l) => `/loans/${l.id}`} />
        <TableFooter shown={rows.length} total={loans.length} noun="loans" />
      </Card>
    </>
  );
}
