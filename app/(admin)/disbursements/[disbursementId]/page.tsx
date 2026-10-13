"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, DefList, DetailLayout, NotFoundState, Notice, PageHeader, ReasonDialog, StatusBadge, type Tone } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { customerName, getDisbursement, type Disbursement } from "@/lib/mock";
import { fmtDateTime, inr } from "@/lib/format";

type Action = "release" | "retry" | "verify" | null;

export default function DisbursementDetailPage() {
  const { disbursementId } = useParams<{ disbursementId: string }>();
  const base = getDisbursement(disbursementId);
  const [status, setStatus] = useState<Disbursement["status"] | null>(null);
  const [action, setAction] = useState<Action>(null);
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null);

  if (!base) return <NotFoundState what="Payout" backHref="/disbursements" backLabel="Back to disbursements" />;

  const d: Disbursement = { ...base, status: status ?? base.status };
  const allPass = d.checks.every((c) => c.ok);
  const failing = d.checks.filter((c) => !c.ok);

  const finish = (next: Disbursement["status"], text: string, tone: Tone) => {
    setStatus(next);
    setNotice({ tone, text });
    setAction(null);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Disbursements", href: "/disbursements" }, { label: d.id }]}
        title={d.id}
        badge={<StatusBadge status={d.status} />}
        description={`${customerName(d.customerId)} · ${inr(d.amount)} for ${d.loanId}`}
      />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <DetailLayout
        main={
          <>
            <Card title="Pre-disbursement checks" description="All of these must pass before a payout can be released.">
              <ul className="divide-y divide-line">
                {d.checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${c.ok ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad"}`}>
                      <Icon name={c.ok ? "check" : "x"} size={14} />
                    </span>
                    <span className="text-sm text-ink">{c.label}</span>
                    {!c.ok && <span className="ml-auto text-xs font-medium text-bad">Failed</span>}
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Payout details">
              <DefList
                cols={3}
                items={[
                  { label: "Amount", value: inr(d.amount) },
                  { label: "Bank", value: d.bank },
                  { label: "Account", value: d.account },
                  { label: "IFSC", value: d.ifsc },
                  { label: "Name match with identity", value: `${d.nameMatch}%` },
                  { label: "Attempts", value: d.attempts },
                  { label: "Provider reference", value: d.providerRef },
                  { label: "Idempotency key", value: <span className="num">{d.idempotencyKey}</span> },
                  { label: "Created", value: fmtDateTime(d.created) },
                ]}
              />
              {d.failureReason && <p className="wrap-any mt-5 rounded-lg bg-warn-soft px-4 py-3 text-sm text-warn">{d.failureReason}</p>}
            </Card>
          </>
        }
        side={
          <>
            <Card title="Action">
              {d.status === "PENDING" && (
                <>
                  <Button variant="primary" className="w-full" disabled={!allPass} onClick={() => setAction("release")}>Release {inr(d.amount)}</Button>
                  {!allPass && <p className="mt-3 text-xs text-bad">Blocked: {failing.map((f) => f.label.toLowerCase()).join(", ")}.</p>}
                  <p className="mt-4 flex gap-2 rounded-lg bg-brand-50 p-3 text-xs text-muted">
                    <Icon name="lock" size={14} className="mt-0.5 shrink-0 text-brand-500" />
                    <span>Release is idempotent. Pressing it twice, or retrying after a timeout, cannot pay out twice. The customer sees success only after the provider confirms.</span>
                  </p>
                </>
              )}
              {d.status === "PROCESSING" && <p className="text-sm text-muted">Sent to the provider. Waiting for the confirmation webhook. No action needed.</p>}
              {d.status === "SUCCESS" && <p className="text-sm text-muted">Paid and confirmed by the provider. The ledger entry and repayment schedule exist.</p>}
              {d.status === "FAILED" && (
                <>
                  <Button className="w-full" onClick={() => setAction("retry")}>Retry payout</Button>
                  <p className="mt-3 text-xs text-muted">Retries reuse the same idempotency key, so the provider rejects a duplicate if the first attempt actually went through.</p>
                </>
              )}
              {d.status === "REQUIRES_REVIEW" && (
                <>
                  <Button className="w-full" onClick={() => setAction("verify")}>Confirm status with provider</Button>
                  <p className="mt-3 text-xs text-muted">Do not retry until the provider confirms whether money moved. See the reconciliation record.</p>
                </>
              )}
              {d.status === "REVERSED" && <p className="text-sm text-muted">This payout was reversed. A reversal entry exists in the ledger.</p>}
            </Card>
            <Card title="Links">
              <ul className="space-y-2 text-sm">
                <li><Link href={`/loans/${d.loanId}`} className="text-brand-700 hover:underline">Loan {d.loanId}</Link></li>
                <li><Link href={`/customers/${d.customerId}`} className="text-brand-700 hover:underline">{customerName(d.customerId)}</Link></li>
              </ul>
            </Card>
          </>
        }
      />

      <ReasonDialog open={action === "release"} title={`Release ${inr(d.amount)}`} description={`To ${d.bank} ${d.account} for ${customerName(d.customerId)}`} confirmLabel="Release payout" tone="primary" reasonLabel="Release note" reasonHint="For example: checks reviewed, bank name match 97%." onClose={() => setAction(null)} onConfirm={() => finish("PROCESSING", `Payout ${d.id} sent to the provider. Status changes to paid only after the provider confirms.`, "brand")} />
      <ReasonDialog open={action === "retry"} title="Retry payout" confirmLabel="Retry payout" reasonLabel="Why is it safe to retry?" reasonHint="Confirm the earlier attempt did not credit the customer." onClose={() => setAction(null)} onConfirm={() => finish("PROCESSING", `Retry sent for ${d.id} using the same idempotency key.`, "brand")} />
      <ReasonDialog open={action === "verify"} title="Confirm status with provider" confirmLabel="Record check" reasonLabel="What did the provider say?" onClose={() => setAction(null)} onConfirm={() => finish("PROCESSING", `Provider status check recorded for ${d.id}.`, "brand")} />
    </>
  );
}
