"use client";

import { Card, DataTable, type Column, Notice, PageHeader, StatusBadge } from "@/components/ui";
import { loanLevels, type LoanLevel } from "@/lib/mock";
import { inr } from "@/lib/format";

export default function LoanLevelsPage() {
  const cols: Column<LoanLevel>[] = [
    { key: "id", header: "Level", render: (l) => <span className="font-display text-base font-semibold text-ink">{l.id}</span> },
    { key: "r", header: "Amount range", render: (l) => <span className="num">{inr(l.min)} – {inr(l.max)}</span> },
    { key: "t", header: "Max tenure", render: (l) => `${l.maxTenureMonths} ${l.maxTenureMonths === 1 ? "month" : "months"}` },
    { key: "d", header: "Decision", render: (l) => <StatusBadge status={l.decision} /> },
    { key: "a", header: "Approval authority", render: (l) => l.approver },
    { key: "p", header: "How customers reach it", minWidth: 260, render: (l) => <span className="block truncate text-sm text-body" title={l.progression}>{l.progression}</span> },
  ];
  return (
    <>
      <PageHeader crumbs={[{ label: "Lending policy", href: "/policy" }, { label: "Loan levels" }]} title="Loan levels" description="Each level sets what a customer can borrow and who decides. Editing creates a draft of the next policy version." />
      <Notice tone="warn">Sandbox example values. Do not treat them as approved credit policy.</Notice>
      <Card flush><DataTable columns={cols} rows={loanLevels} rowKey={(l) => l.id} rowHref={(l) => `/policy/loan-levels/${l.id}`} /></Card>
    </>
  );
}
