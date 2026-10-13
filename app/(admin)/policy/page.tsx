"use client";

import Link from "next/link";
import { Card, DataTable, type Column, LinkButton, Notice, PageHeader, StatusBadge } from "@/components/ui";
import { policies, type PolicyVersion } from "@/lib/mock";
import { fmtDate } from "@/lib/format";

export default function PolicyPage() {
  const columns: Column<PolicyVersion>[] = [
    { key: "v", header: "Version", render: (p) => (<div><p className="font-medium text-ink">Version {p.version}</p><p className="num text-xs text-muted">{p.id}</p></div>) },
    { key: "s", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
    { key: "eff", header: "Effective from", render: (p) => <span className="whitespace-nowrap">{fmtDate(p.effectiveFrom)}</span> },
    { key: "sum", header: "Summary", minWidth: 300, render: (p) => <span className="block truncate text-sm text-body" title={p.summary}>{p.summary}</span> },
    { key: "a", header: "Author", render: (p) => p.author },
    { key: "ap", header: "Approved by", render: (p) => p.approvedBy },
    { key: "d", header: "Decisions", align: "right", render: (p) => <span className="num">{p.decisionsMade}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Lending policy"
        description="Every decision stores the policy version it used. Changes create a new version that needs a second person's approval."
        actions={<LinkButton href="/policy/loan-levels" variant="primary">Loan levels</LinkButton>}
      />
      <Notice tone="warn">Levels, limits and rules shown here are sandbox examples. Live values must come from the lender&apos;s approved credit policy.</Notice>
      <Card flush>
        <DataTable columns={columns} rows={policies} rowKey={(p) => p.id} rowHref={(p) => `/policy/${p.id}`} />
      </Card>
      <p className="mt-4 text-sm text-muted">
        Looking for amounts and tenures? <Link href="/policy/loan-levels" className="font-medium text-brand-700 hover:underline">Open loan levels</Link>.
      </p>
    </>
  );
}
