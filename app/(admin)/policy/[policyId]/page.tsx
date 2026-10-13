"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, DefList, DetailLayout, NotFoundState, Notice, PageHeader, ReasonDialog, StatusBadge, Timeline, DataTable, type Column, type Tone } from "@/components/ui";
import { getPolicy, loanLevels, type LoanLevel, type PolicyVersion } from "@/lib/mock";
import { fmtDate, inr } from "@/lib/format";

const CURRENT_USER = "Admin User";

export default function PolicyDetailPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const base = getPolicy(policyId);
  const [status, setStatus] = useState<PolicyVersion["status"] | null>(null);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null);

  if (!base) return <NotFoundState what="Policy version" backHref="/policy" backLabel="Back to policy" />;

  const p: PolicyVersion = { ...base, status: status ?? base.status };
  const ownDraft = p.author === CURRENT_USER;

  const cols: Column<LoanLevel>[] = [
    { key: "id", header: "Level", render: (l) => <Link href={`/policy/loan-levels/${l.id}`} className="font-medium text-brand-700 hover:underline">{l.id}</Link> },
    { key: "r", header: "Amount range", render: (l) => <span className="num">{inr(l.min)} – {inr(l.max)}</span> },
    { key: "t", header: "Max tenure", render: (l) => `${l.maxTenureMonths} ${l.maxTenureMonths === 1 ? "month" : "months"}` },
    { key: "d", header: "Decision", render: (l) => <StatusBadge status={l.decision} /> },
  ];

  return (
    <>
      <PageHeader crumbs={[{ label: "Lending policy", href: "/policy" }, { label: `Version ${p.version}` }]} title={`Policy version ${p.version}`} badge={<StatusBadge status={p.status} />} description={p.summary} />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <DetailLayout
        main={
          <>
            <Card title="What changed in this version"><Timeline items={p.changes.map((c) => ({ title: c }))} /></Card>
            <Card title="Loan levels in this version" description="Example values" flush><DataTable columns={cols} rows={loanLevels} rowKey={(l) => l.id} /></Card>
          </>
        }
        side={
          <>
            <Card title="Details">
              <DefList cols={1} items={[{ label: "Policy ID", value: p.id }, { label: "Effective from", value: fmtDate(p.effectiveFrom) }, { label: "Author", value: p.author }, { label: "Approved by", value: p.approvedBy }, { label: "Decisions made with it", value: p.decisionsMade }]} />
            </Card>
            {p.status === "DRAFT" && (
              <Card title="Approval">
                <Button variant="primary" className="w-full" disabled={ownDraft} onClick={() => setOpen(true)}>Approve and schedule</Button>
                <p className="mt-3 text-xs text-muted">{ownDraft ? "You wrote this draft, so someone else must approve it." : "Approving makes it live from the effective date. The current version is kept for past decisions."}</p>
              </Card>
            )}
          </>
        }
      />

      <ReasonDialog open={open} title="Approve policy version" description={`Version ${p.version} goes live on ${fmtDate(p.effectiveFrom)}.`} confirmLabel="Approve" tone="primary" reasonLabel="Approval note" onClose={() => setOpen(false)} onConfirm={() => { setStatus("ACTIVE"); setNotice({ tone: "ok", text: `Version ${p.version} approved. It becomes active on ${fmtDate(p.effectiveFrom)}.` }); setOpen(false); }} />
    </>
  );
}
