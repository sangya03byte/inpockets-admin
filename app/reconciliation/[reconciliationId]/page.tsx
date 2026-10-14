"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, DefList, DetailLayout, NotFoundState, Notice, PageHeader, ReasonDialog, StatusBadge, type Tone } from "@/components/ui";
import { getReconciliation, type Reconciliation } from "@/lib/mock";
import { fmtDate, inr } from "@/lib/format";

type Action = "adjust" | "resolve" | null;

export default function ReconciliationDetailPage() {
  const { reconciliationId } = useParams<{ reconciliationId: string }>();
  const base = getReconciliation(reconciliationId);
  const [status, setStatus] = useState<Reconciliation["status"] | null>(null);
  const [action, setAction] = useState<Action>(null);
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null);

  if (!base) return <NotFoundState what="Reconciliation record" backHref="/reconciliation" backLabel="Back to reconciliation" />;

  const r: Reconciliation = { ...base, status: status ?? base.status };
  const sources = [
    { name: "Our ledger", value: r.ledger },
    { name: "Payment provider", value: r.provider },
    { name: "Bank settlement", value: r.bank },
  ];
  const href = r.type === "DISBURSEMENT" ? `/disbursements/${r.txnId}` : "/payments";

  const finish = (text: string, tone: Tone) => {
    setStatus("RESOLVED");
    setNotice({ tone, text });
    setAction(null);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Reconciliation", href: "/reconciliation" }, { label: r.id }]}
        title={r.id}
        badge={<StatusBadge status={r.status} />}
        description={`${r.type === "DISBURSEMENT" ? "Payout" : "Repayment"} ${r.txnId} · ${fmtDate(r.date)}`}
      />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <DetailLayout
        main={
          <>
            <Card title="Three-way comparison">
              <div className="grid grid-cols-3 gap-4">
                {sources.map((s) => {
                  const differs = s.value !== r.ledger;
                  return (
                    <div key={s.name} className={`min-w-0 rounded-lg p-4 ring-1 ring-inset ${differs ? "bg-bad-soft ring-[#f6c5c2]" : "bg-sunken ring-line"}`}>
                      <p className="text-xs text-muted">{s.name}</p>
                      <p className="num mt-1 font-display text-2xl font-semibold text-ink">{inr(s.value)}</p>
                      {differs && <p className="num mt-1 text-xs font-medium text-bad">{s.value - r.ledger > 0 ? "+" : "−"}{inr(Math.abs(s.value - r.ledger))} vs ledger</p>}
                    </div>
                  );
                })}
              </div>
              {r.note && <p className="wrap-any mt-5 text-sm text-body">{r.note}</p>}
            </Card>
            <Card title="Transaction">
              <DefList cols={2} items={[{ label: "Transaction", value: <Link href={href} className="text-brand-700 hover:underline">{r.txnId}</Link> }, { label: "Type", value: r.type === "DISBURSEMENT" ? "Payout" : "Repayment" }, { label: "Date", value: fmtDate(r.date) }, { label: "Status", value: <StatusBadge status={r.status} /> }]} />
            </Card>
          </>
        }
        side={
          <Card title="Resolve">
            {r.status === "MISMATCH" ? (
              <div className="space-y-2">
                <Button variant="primary" className="w-full" onClick={() => setAction("adjust")}>Post adjustment entry</Button>
                <Button className="w-full" onClick={() => setAction("resolve")}>Mark as explained</Button>
                <p className="pt-2 text-xs text-muted">Ledger history is never edited. Corrections are posted as new reversal or adjustment entries.</p>
              </div>
            ) : (
              <p className="text-sm text-muted">{r.status === "MATCHED" ? "All three sources agree. Nothing to do." : "This break has been resolved and is kept for audit."}</p>
            )}
          </Card>
        }
      />

      <ReasonDialog open={action === "adjust"} title="Post adjustment entry" description="Creates a new ledger entry that brings the ledger in line with the provider." confirmLabel="Post adjustment" reasonLabel="Reason and evidence" onClose={() => setAction(null)} onConfirm={() => finish(`Adjustment posted for ${r.id}.`, "ok")} />
      <ReasonDialog open={action === "resolve"} title="Mark as explained" confirmLabel="Mark explained" reasonLabel="Explanation" onClose={() => setAction(null)} onConfirm={() => finish(`${r.id} marked as explained.`, "ok")} />
    </>
  );
}
