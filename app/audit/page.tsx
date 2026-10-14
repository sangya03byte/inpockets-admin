"use client";

import { useMemo, useState } from "react";
import { Card, DataTable, type Column, Dialog, DefList, PageHeader, SearchField, SelectField, TableFooter, Toolbar, Badge } from "@/components/ui";
import { auditEvents, type AuditEvent } from "@/lib/mock";
import { fmtDateTime, humanize } from "@/lib/format";

export default function AuditPage() {
  const [q, setQ] = useState("");
  const [entity, setEntity] = useState("all");
  const [open, setOpen] = useState<AuditEvent | null>(null);

  const entities = useMemo(() => Array.from(new Set(auditEvents.map((e) => e.entity))), []);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return auditEvents
      .filter((e) => entity === "all" || e.entity === entity)
      .filter((e) => !term || [e.actor, e.action, e.entityId, e.reason, e.requestId].some((v) => v.toLowerCase().includes(term)))
      .sort((a, b) => b.at.localeCompare(a.at));
  }, [q, entity]);

  const columns: Column<AuditEvent>[] = [
    { key: "at", header: "When", render: (e) => <span className="whitespace-nowrap text-muted">{fmtDateTime(e.at)}</span> },
    { key: "actor", header: "Who", minWidth: 180, render: (e) => (<div className="min-w-0"><p className="truncate font-medium text-ink">{e.actor}</p><p className="truncate text-xs text-muted">{e.role}</p></div>) },
    { key: "act", header: "Action", minWidth: 240, render: (e) => <span className="block truncate text-sm text-ink" title={humanize(e.action)}>{humanize(e.action)}</span> },
    { key: "ent", header: "Record", render: (e) => (<div><p className="num text-ink">{e.entityId}</p><p className="text-xs text-muted">{e.entity}</p></div>) },
    { key: "reason", header: "Reason", minWidth: 260, render: (e) => <span className="block truncate text-sm text-body" title={e.reason}>{e.reason}</span> },
  ];

  return (
    <>
      <PageHeader title="Audit log" description="Append-only record of who did what and why. Entries cannot be edited or deleted from this console." />
      <Card flush>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search actor, action, record or request ID" width={380} />
          <SelectField label="Record type" value={entity} onChange={setEntity} options={[{ value: "all", label: "All record types" }, ...entities.map((e) => ({ value: e, label: e }))]} />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(e) => e.id} onRowClick={setOpen} />
        <TableFooter shown={rows.length} total={auditEvents.length} noun="events" />
      </Card>

      <Dialog open={!!open} onClose={() => setOpen(null)} title={open ? humanize(open.action) : ""} description={open ? `${open.id} · ${fmtDateTime(open.at)}` : undefined} width={560}>
        {open && (
          <>
            <DefList
              cols={2}
              items={[
                { label: "Actor", value: open.actor },
                { label: "Role", value: open.role },
                { label: "Record", value: `${open.entity} ${open.entityId}` },
                { label: "Request ID", value: <span className="num">{open.requestId}</span> },
                { label: "IP address", value: open.ip },
                { label: "Reason", value: open.reason },
              ]}
            />
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="min-w-0 rounded-lg bg-bad-soft p-3"><p className="mb-1 text-xs text-muted">Before</p><p className="wrap-any text-sm text-ink">{open.before}</p></div>
              <div className="min-w-0 rounded-lg bg-ok-soft p-3"><p className="mb-1 text-xs text-muted">After</p><p className="wrap-any text-sm text-ink">{open.after}</p></div>
            </div>
            <p className="mt-4"><Badge tone="neutral" dot={false}>Read only</Badge></p>
          </>
        )}
      </Dialog>
    </>
  );
}
