"use client";

import { useMemo, useState } from "react";
import { Card, DataTable, type Column, PageHeader, Person, SearchField, Segmented, StatusBadge, TableFooter, Toolbar, Notice } from "@/components/ui";
import { customerName, disbursements, type Disbursement } from "@/lib/mock";
import { fmtDateTime, inr } from "@/lib/format";

type Filter = "all" | "PENDING" | "PROCESSING" | "SUCCESS" | "attention";

export default function DisbursementsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const match = (d: Disbursement, f: Filter) => (f === "all" ? true : f === "attention" ? d.status === "FAILED" || d.status === "REQUIRES_REVIEW" : d.status === f);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return disbursements
      .filter((d) => match(d, filter))
      .filter((d) => !term || d.id.toLowerCase().includes(term) || d.loanId.toLowerCase().includes(term) || customerName(d.customerId).toLowerCase().includes(term));
  }, [q, filter]);

  const columns: Column<Disbursement>[] = [
    { key: "id", header: "Payout", render: (d) => <span className="num font-medium text-ink">{d.id}</span> },
    { key: "loan", header: "Loan", render: (d) => <span className="num text-muted">{d.loanId}</span> },
    { key: "cus", header: "Customer", minWidth: 200, render: (d) => <Person name={customerName(d.customerId)} sub={`${d.bank} ${d.account}`} /> },
    { key: "amt", header: "Amount", align: "right", render: (d) => <span className="num font-medium text-ink">{inr(d.amount)}</span> },
    { key: "s", header: "Status", render: (d) => <StatusBadge status={d.status} /> },
    { key: "at", header: "Created", render: (d) => <span className="whitespace-nowrap text-muted">{fmtDateTime(d.created)}</span> },
  ];

  const count = (f: Filter) => disbursements.filter((d) => match(d, f)).length;

  return (
    <>
      <PageHeader title="Disbursements" description="Money leaves the account only after a person releases it here. Each payout can be sent once." />
      {disbursements.some((d) => d.status === "PENDING") && <Notice tone="brand">{count("PENDING")} payout is ready for release. Open it to review the pre-disbursement checks.</Notice>}
      <Card flush>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search payout, loan or customer" />
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: count("all") },
              { value: "PENDING", label: "Ready to release", count: count("PENDING") },
              { value: "PROCESSING", label: "Processing", count: count("PROCESSING") },
              { value: "SUCCESS", label: "Paid", count: count("SUCCESS") },
              { value: "attention", label: "Needs attention", count: count("attention") },
            ]}
          />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(d) => d.id} rowHref={(d) => `/disbursements/${d.id}`} />
        <TableFooter shown={rows.length} total={disbursements.length} noun="payouts" />
      </Card>
    </>
  );
}
