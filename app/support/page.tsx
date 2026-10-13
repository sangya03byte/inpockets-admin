"use client";

import { useMemo, useState } from "react";
import { Card, DataTable, type Column, PageHeader, Person, SearchField, Segmented, StatusBadge, TableFooter, Toolbar, Badge } from "@/components/ui";
import { customerName, tickets, type Ticket } from "@/lib/mock";
import { fmtDateTime } from "@/lib/format";

type Filter = "all" | "open" | Ticket["status"];

const isOpen = (t: Ticket) => t.status !== "RESOLVED";

export default function SupportPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("open");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return tickets
      .filter((t) => (filter === "all" ? true : filter === "open" ? isOpen(t) : t.status === filter))
      .filter((t) => !term || t.id.toLowerCase().includes(term) || t.subject.toLowerCase().includes(term) || customerName(t.customerId).toLowerCase().includes(term));
  }, [q, filter]);

  const columns: Column<Ticket>[] = [
    { key: "id", header: "Ticket", minWidth: 280, render: (t) => (<div className="min-w-0"><p className="truncate font-medium text-ink" title={t.subject}>{t.subject}</p><p className="num text-xs text-muted">{t.id} · {t.category}</p></div>) },
    { key: "cus", header: "Customer", minWidth: 190, render: (t) => <Person name={customerName(t.customerId)} /> },
    { key: "pri", header: "Priority", render: (t) => <StatusBadge status={t.priority} /> },
    { key: "s", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
    { key: "who", header: "Assignee", render: (t) => t.assignee },
    { key: "sla", header: "Reply due", render: (t) => (<span className="whitespace-nowrap">{isOpen(t) && t.slaDue < "2026-10-13T12:00" ? <Badge tone="bad">{fmtDateTime(t.slaDue)}</Badge> : <span className="text-muted">{fmtDateTime(t.slaDue)}</span>}</span>) },
  ];

  return (
    <>
      <PageHeader title="Support" description="Customer tickets with reply deadlines. Support staff can help customers but cannot approve loans or change policy." />
      <Card flush>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search ticket, subject or customer" />
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "open", label: "Open", count: tickets.filter(isOpen).length },
              { value: "WAITING_ON_CUSTOMER", label: "Waiting on customer", count: tickets.filter((t) => t.status === "WAITING_ON_CUSTOMER").length },
              { value: "RESOLVED", label: "Resolved", count: tickets.filter((t) => t.status === "RESOLVED").length },
              { value: "all", label: "All", count: tickets.length },
            ]}
          />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(t) => t.id} rowHref={(t) => `/support/${t.id}`} />
        <TableFooter shown={rows.length} total={tickets.length} noun="tickets" />
      </Card>
    </>
  );
}
