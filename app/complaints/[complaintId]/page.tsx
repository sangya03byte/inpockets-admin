"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, DefList, DetailLayout, NotFoundState, Notice, PageHeader, ReasonDialog, StatusBadge, Timeline, type Tone } from "@/components/ui";
import { complaints, customerName, getComplaint, type Complaint } from "@/lib/mock";
import { fmtDate, fmtDateTime, NOW_ISO } from "@/lib/format";

type Action = "escalate" | "resolve" | "note" | null;

export default function ComplaintDetailPage() {
  const { complaintId } = useParams<{ complaintId: string }>();
  const base = getComplaint(complaintId);
  const [local, setLocal] = useState<Partial<Complaint>>({});
  const [action, setAction] = useState<Action>(null);
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null);

  if (!base) return <NotFoundState what="Complaint" backHref="/complaints" backLabel="Back to complaints" />;

  const c: Complaint = { ...base, ...local, history: [...(local.history ?? base.history)] };
  const closed = c.status === "RESOLVED";
  const peers = complaints.filter((x) => x.customerId === c.customerId && x.id !== c.id);

  const log = (title: string, note: string, patch: Partial<Complaint>, text: string, tone: Tone = "ok") => {
    setLocal({ ...local, ...patch, history: [...c.history, { at: NOW_ISO, title, note }] });
    setNotice({ tone, text });
    setAction(null);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Complaints", href: "/complaints" }, { label: c.id }]}
        title={c.subject}
        badge={<StatusBadge status={c.status} />}
        description={`${c.id} · ${customerName(c.customerId)} · ${c.category}`}
        actions={
          !closed ? (
            <>
              <Button onClick={() => setAction("note")}>Add note</Button>
              {c.level < 3 && <Button onClick={() => setAction("escalate")}>Escalate to level {c.level + 1}</Button>}
              <Button variant="primary" onClick={() => setAction("resolve")}>Resolve</Button>
            </>
          ) : undefined
        }
      />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <DetailLayout
        main={
          <>
            <Card title="What the customer said">
              <p className="wrap-any text-sm text-body">{c.description}</p>
            </Card>
            <Card title="History">
              <Timeline items={c.history.map((h) => ({ title: h.title, meta: fmtDateTime(h.at), body: h.note }))} />
            </Card>
          </>
        }
        side={
          <>
            <Card title="Details">
              <DefList
                cols={1}
                items={[
                  { label: "Customer", value: <Link href={`/customers/${c.customerId}`} className="text-brand-700 hover:underline">{customerName(c.customerId)}</Link> },
                  { label: "Escalation level", value: `Level ${c.level}` },
                  { label: "Owner", value: c.owner },
                  { label: "Received", value: fmtDate(c.received) },
                  { label: "Resolve by", value: fmtDate(c.slaDue) },
                ]}
              />
            </Card>
            {peers.length > 0 && (
              <Card title="Other complaints from this customer">
                <ul className="space-y-2 text-sm">
                  {peers.map((p) => (<li key={p.id}><Link href={`/complaints/${p.id}`} className="text-brand-700 hover:underline">{p.id}</Link> <span className="text-muted">· {p.subject}</span></li>))}
                </ul>
              </Card>
            )}
          </>
        }
      />

      <ReasonDialog open={action === "note"} title="Add internal note" confirmLabel="Save note" reasonLabel="Note" reasonHint="Visible to staff only." onClose={() => setAction(null)} onConfirm={(r) => log("Note added", r, { status: c.status === "OPEN" ? "IN_PROGRESS" : c.status }, "Note saved.")} />
      <ReasonDialog open={action === "escalate"} title={`Escalate to level ${c.level + 1}`} confirmLabel="Escalate" reasonLabel="Why is this being escalated?" onClose={() => setAction(null)} onConfirm={(r) => log(`Escalated to level ${c.level + 1}`, r, { level: (c.level + 1) as Complaint["level"], status: "ESCALATED" }, `${c.id} escalated.`, "warn")} />
      <ReasonDialog open={action === "resolve"} title="Resolve complaint" description="The customer is told the outcome in plain language." confirmLabel="Resolve" tone="success" reasonLabel="Resolution" onClose={() => setAction(null)} onConfirm={(r) => log("Resolved", r, { status: "RESOLVED" }, `${c.id} resolved.`)} />
    </>
  );
}
