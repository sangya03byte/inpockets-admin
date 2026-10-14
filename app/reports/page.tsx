"use client";

import { Button, Card, DataTable, type Column, Grid, PageHeader, Stat, StatusBadge } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { dpdBuckets, providerHealth, reportMonths, riskDistribution } from "@/lib/mock";
import { inr } from "@/lib/format";

type Health = (typeof providerHealth)[number];

export default function ReportsPage() {
  const latest = reportMonths[reportMonths.length - 1];
  const approval = Math.round((latest.approved / latest.applications) * 100);
  const maxApps = Math.max(...reportMonths.map((m) => m.applications));
  const maxDisb = Math.max(...reportMonths.map((m) => m.disbursed));
  const maxBucket = Math.max(...dpdBuckets.map((b) => b.amount));

  function exportCsv() {
    const header = "Month,Applications,Approved,Disbursed (INR)";
    const lines = reportMonths.map((m) => `${m.month},${m.applications},${m.approved},${m.disbursed}`);
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inpockets-monthly-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const healthCols: Column<Health>[] = [
    { key: "n", header: "Provider", render: (p) => <span className="font-medium text-ink">{p.name}</span> },
    { key: "s", header: "Status", render: (p) => <StatusBadge status={p.status === "OK" ? "ACTIVE" : "AT_RISK"} /> },
    { key: "f", header: "Failures (24h)", align: "right", render: (p) => <span className="num">{p.failures}</span> },
    { key: "p", header: "p95 latency", align: "right", render: (p) => <span className="num">{p.p95}</span> },
  ];

  return (
    <>
      <PageHeader title="Reports" description="Sandbox figures. In production these come from the reporting jobs, with no personal data exposed." actions={<Button onClick={exportCsv}><Icon name="download" size={16} />Export CSV</Button>} />

      <Grid cols={4} className="mb-6">
        <Stat label={`Applications in ${latest.month}`} value={latest.applications} />
        <Stat label="Approval rate" value={`${approval}%`} hint="Approved of decided" />
        <Stat label="Disbursed this month" value={inr(latest.disbursed)} />
        <Stat label="Manual review share" value="46%" hint="Of applications this month" />
      </Grid>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <Card title="Applications and approvals" description="By month">
          <div className="flex h-48 items-end gap-5" role="img" aria-label="Applications and approvals by month">
            {reportMonths.map((m) => (
              <div key={m.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex h-40 w-full items-end justify-center gap-1.5">
                  <div className="w-1/2 max-w-6 rounded-t bg-brand-200" style={{ height: `${(m.applications / maxApps) * 100}%` }} title={`${m.applications} applications`} />
                  <div className="w-1/2 max-w-6 rounded-t bg-brand-600" style={{ height: `${(m.approved / maxApps) * 100}%` }} title={`${m.approved} approved`} />
                </div>
                <span className="text-xs text-muted">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-5 text-xs text-muted">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-brand-200" />Applications</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-brand-600" />Approved</span>
          </div>
        </Card>

        <Card title="Disbursed amount" description="By month">
          <div className="flex h-48 items-end gap-5" role="img" aria-label="Disbursed amount by month">
            {reportMonths.map((m) => (
              <div key={m.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span className="num text-[11px] text-muted">{Math.round(m.disbursed / 1000)}k</span>
                <div className="flex h-32 w-full items-end justify-center">
                  <div className="w-full max-w-10 rounded-t bg-brand-500" style={{ height: `${(m.disbursed / maxDisb) * 100}%` }} />
                </div>
                <span className="text-xs text-muted">{m.month}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-6">
        <Card title="Overdue by days past due" description="Outstanding amount per bucket">
          <ul className="space-y-4">
            {dpdBuckets.map((b) => (
              <li key={b.label} className="grid grid-cols-[96px_minmax(0,1fr)_150px] items-center gap-4 text-sm">
                <span className="text-body">{b.label}</span>
                <span className="h-2 overflow-hidden rounded-full bg-brand-100"><span className={`block h-full rounded-full ${b.label === "Current" ? "bg-brand-500" : "bg-[#e39a2d]"}`} style={{ width: `${(b.amount / maxBucket) * 100}%` }} /></span>
                <span className="num text-right text-muted">{inr(b.amount)} · {b.loans} loans</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Risk distribution" description="Share of assessed applications">
          <ul className="space-y-4">
            {riskDistribution.map((r) => (
              <li key={r.band} className="grid grid-cols-[96px_minmax(0,1fr)_48px] items-center gap-4 text-sm">
                <span className="text-body">{r.band}</span>
                <span className="h-2 overflow-hidden rounded-full bg-brand-100"><span className={`block h-full rounded-full ${r.band === "Low" ? "bg-ok" : r.band === "Medium" ? "bg-[#e39a2d]" : "bg-bad"}`} style={{ width: `${r.share}%` }} /></span>
                <span className="num text-right text-muted">{r.share}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Provider reliability" flush>
        <DataTable columns={healthCols} rows={providerHealth} rowKey={(p) => p.name} />
      </Card>
    </>
  );
}
