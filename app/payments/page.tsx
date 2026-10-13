"use client";

import { useMemo, useState } from "react";
import { Card, DataTable, type Column, PageHeader, Person, SearchField, Segmented, StatusBadge, TableFooter, Toolbar } from "@/components/ui";
import { customerName, payments, type Payment } from "@/lib/mock";
import { fmtDate, inr } from "@/lib/format";

type Filter = "all" | Payment["status"];

export default function PaymentsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return payments
      .filter((p) => filter === "all" || p.status === filter)
      .filter((p) => !term || p.id.toLowerCase().includes(term) || p.loanId.toLowerCase().includes(term) || p.providerRef.toLowerCase().includes(term) || customerName(p.customerId).toLowerCase().includes(term));
  }, [q, filter]);

  const columns: Column<Payment>[] = [
    { key: "id", header: "Payment", render: (p) => <span className="num font-medium text-ink">{p.id}</span> },
    { key: "cus", header: "Customer", minWidth: 200, render: (p) => <Person name={customerName(p.customerId)} sub={`${p.loanId} · instalment ${p.installment}`} /> },
    { key: "amt", header: "Amount", align: "right", render: (p) => <span className="num font-medium text-ink">{inr(p.amount)}</span> },
    { key: "m", header: "Method", render: (p) => p.method },
    { key: "ref", header: "Provider reference", render: (p) => <span className="num text-sm text-muted">{p.providerRef}</span> },
    { key: "wh", header: "Webhook", render: (p) => <StatusBadge status={p.webhook} /> },
    { key: "s", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
    { key: "d", header: "Date", render: (p) => <span className="whitespace-nowrap text-muted">{fmtDate(p.date)}</span> },
  ];

  const count = (f: Filter) => (f === "all" ? payments.length : payments.filter((p) => p.status === f).length);

  return (
    <>
      <PageHeader title="Payments" description="Repayments count only after the provider's webhook is verified. The app's own success message is never trusted." />
      <Card flush>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search payment, loan, customer or reference" width={360} />
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: count("all") },
              { value: "SUCCESS", label: "Successful", count: count("SUCCESS") },
              { value: "PENDING", label: "Pending", count: count("PENDING") },
              { value: "FAILED", label: "Failed", count: count("FAILED") },
            ]}
          />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(p) => p.id} />
        <TableFooter shown={rows.length} total={payments.length} noun="payments" />
      </Card>
    </>
  );
}
