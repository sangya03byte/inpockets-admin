"use client";

import Link from "next/link";
import {
  Badge, Card, DataTable, type Column, PageHeader, Person, StatusBadge, Stat, Meter, Grid,
} from "@/components/ui";
import { applications, collectionCases, complaints, customerName, disbursements, loans, providerHealth, reconciliations, kycRecords, fraudCases, tickets, type Application, type Disbursement, NOW } from "@/lib/mock";
import { fmtDateTime, inr, daysBetween, TODAY } from "@/lib/format";

export default function DashboardPage() {
  const review = applications.filter((a) => a.state === "MANUAL_REVIEW" || a.state === "PENDING_INFORMATION");
  const kycOpen = kycRecords.filter((k) => k.state === "MANUAL_REVIEW" || k.state === "PENDING").length;
  const fraudOpen = fraudCases.filter((f) => f.state !== "CLEARED").length;
  const toRelease = disbursements.filter((d) => d.status === "PENDING");
  const mismatches = reconciliations.filter((r) => r.status === "MISMATCH").length;
  const overdue = loans.filter((l) => l.status === "OVERDUE");
  const overdueAmount = overdue.reduce((s, l) => s + l.outstanding, 0);
  const openTickets = tickets.filter((t) => t.status !== "RESOLVED").length;
  const activeCases = collectionCases.filter((c) => c.stage !== "RESOLVED" && c.dpd > 0).length;

  const queueColumns: Column<Application>[] = [
    { key: "app", header: "Application", render: (a) => (<div className="min-w-0"><p className="num font-medium text-ink">{a.id}</p><p className="truncate text-xs text-muted">{a.purpose}</p></div>) },
    { key: "cus", header: "Customer", render: (a) => <Person name={customerName(a.customerId)} /> },
    { key: "amt", header: "Requested", align: "right", render: (a) => <span className="num">{inr(a.requested)}</span> },
    { key: "risk", header: "Risk", render: (a) => (a.risk.band ? <StatusBadge status={a.risk.band} /> : <span className="text-xs text-faint">Pending</span>) },
    { key: "age", header: "Waiting", render: (a) => { const d = daysBetween(a.submitted.slice(0, 10), TODAY); return <span className="text-sm text-muted">{d === 0 ? "Today" : `${d}d`}</span>; } },
  ];

  const releaseColumns: Column<Disbursement>[] = [
    { key: "id", header: "Payout", render: (d) => <span className="num font-medium text-ink">{d.id}</span> },
    { key: "cus", header: "Customer", render: (d) => <Person name={customerName(d.customerId)} /> },
    { key: "amt", header: "Amount", align: "right", render: (d) => <span className="num">{inr(d.amount)}</span> },
  ];

  return (
    <>
      <PageHeader title="Today" description={`Work waiting for a person · updated ${fmtDateTime(NOW)}`} />

      <Grid cols={5} className="mb-6">
        <Stat label="Applications to decide" value={review.length} hint={`${review.filter((a) => a.state === "PENDING_INFORMATION").length} waiting on customer info`} href="/applications" />
        <Stat label="KYC and fraud reviews" value={kycOpen + fraudOpen} hint={`${kycOpen} KYC · ${fraudOpen} fraud`} href="/kyc" />
        <Stat label="Payouts to release" value={toRelease.length} hint={toRelease.length ? inr(toRelease.reduce((s, d) => s + d.amount, 0)) + " ready" : "Nothing waiting"} tone="ok" href="/disbursements" />
        <Stat label="Overdue loans" value={overdue.length} hint={`${inr(overdueAmount)} outstanding`} tone="bad" href="/collections" />
        <Stat label="Reconciliation breaks" value={mismatches} hint={mismatches ? "Needs finance review" : "All matched"} tone={mismatches ? "warn" : "ok"} href="/reconciliation" />
      </Grid>

      <div className="grid grid-cols-[minmax(0,1fr)_400px] items-start gap-6">
        <Card
          title="Application queue"
          description="Waiting for a decision or more information, oldest first"
          flush
          action={<Link href="/applications" className="text-sm font-medium text-brand-700 hover:underline">Open queue</Link>}
        >
          <DataTable columns={queueColumns} rows={[...review].sort((a, b) => a.submitted.localeCompare(b.submitted))} rowKey={(a) => a.id} rowHref={(a) => `/applications/${a.id}`} />
        </Card>

        <div className="min-w-0 space-y-6">
          <Card title="Ready to release" description="Approved, signed and bank-verified" flush action={<Link href="/disbursements" className="text-sm font-medium text-brand-700 hover:underline">All payouts</Link>}>
            <DataTable
              columns={releaseColumns}
              rows={toRelease}
              rowKey={(d) => d.id}
              rowHref={(d) => `/disbursements/${d.id}`}
              empty={<p className="px-5 py-8 text-center text-sm text-muted">No payouts are waiting for release.</p>}
            />
          </Card>

          <Card title="Servicing" description="Open items outside underwriting">
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between"><Link href="/collections" className="text-body hover:text-brand-700">Active collection cases</Link><span className="num font-medium text-ink">{activeCases}</span></li>
              <li className="flex items-center justify-between"><Link href="/support" className="text-body hover:text-brand-700">Open support tickets</Link><span className="num font-medium text-ink">{openTickets}</span></li>
              <li className="flex items-center justify-between"><Link href="/complaints" className="text-body hover:text-brand-700">Complaints in progress</Link><span className="num font-medium text-ink">{complaints.filter((c) => c.status !== "RESOLVED").length}</span></li>
            </ul>
          </Card>
        </div>
      </div>

      <Card title="Provider health" description="Last 24 hours" className="mt-6">
        <div className="grid grid-cols-6 gap-6">
          {providerHealth.map((p) => (
            <div key={p.name} className="min-w-0">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                <Badge tone={p.status === "OK" ? "ok" : "warn"} dot={false}>{p.status === "OK" ? "OK" : "Slow"}</Badge>
              </div>
              <Meter value={p.failures} max={20} tone={p.status === "OK" ? "ok" : "warn"} label={`${p.name} failures`} />
              <p className="mt-2 text-xs text-muted">{p.failures} failures · p95 {p.p95}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
