"use client";

import { useMemo, useState } from "react";
import { Card, DataTable, type Column, PageHeader, Person, SearchField, Segmented, StatusBadge, TableFooter, Toolbar } from "@/components/ui";
import { complaints, customerName, type Complaint } from "@/lib/mock";
import { fmtDate } from "@/lib/format";

type Filter = "all" | "open" | "RESOLVED";
const isOpen = (c: Complaint) => c.status !== "RESOLVED";

export default function ComplaintsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("open");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return complaints
      .filter((c) => (filter === "all" ? true : filter === "open" ? isOpen(c) : c.status === "RESOLVED"))
      .filter((c) => !term || c.id.toLowerCase().includes(term) || c.subject.toLowerCase().includes(term) || customerName(c.customerId).toLowerCase().includes(term));
  }, [q, filter]);

  const columns: Column<Complaint>[] = [
    { key: "id", header: "Complaint", minWidth: 300, render: (c) => (<div className="min-w-0"><p className="truncate font-medium text-ink" title={c.subject}>{c.subject}</p><p className="num text-xs text-muted">{c.id} · {c.category}</p></div>) },
    { key: "cus", header: "Customer", minWidth: 190, render: (c) => <Person name={customerName(c.customerId)} /> },
    { key: "lvl", header: "Level", render: (c) => <span className="num">Level {c.level}</span> },
    { key: "s", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "own", header: "Owner", render: (c) => c.owner },
    { key: "rec", header: "Received", render: (c) => <span className="whitespace-nowrap text-muted">{fmtDate(c.received)}</span> },
    { key: "sla", header: "Resolve by", render: (c) => <span className="whitespace-nowrap text-muted">{fmtDate(c.slaDue)}</span> },
  ];

  return (
    <>
      <PageHeader title="Complaints" description="Formal grievances with an owner, a deadline and an escalation path." />
      <Card flush>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search complaint or customer" />
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "open", label: "Open", count: complaints.filter(isOpen).length },
              { value: "RESOLVED", label: "Resolved", count: complaints.filter((c) => c.status === "RESOLVED").length },
              { value: "all", label: "All", count: complaints.length },
            ]}
          />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} rowHref={(c) => `/complaints/${c.id}`} />
        <TableFooter shown={rows.length} total={complaints.length} noun="complaints" />
      </Card>
    </>
  );
}
