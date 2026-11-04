"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, DefList, DetailLayout, NotFoundState, Notice, PageHeader, ReasonDialog, StatusBadge, Timeline } from "@/components/ui";
import { ErrorNote, Loading, money, useAction } from "@/components/live";
import { api } from "@/lib/api";
import { fmtDateTime, humanize } from "@/lib/format";
import { useSession } from "@/lib/session";
import type { Disbursement } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export default function DisbursementDetail() {
  const { disbursementId: id } = useParams<{ disbursementId: string }>();
  const { can } = useSession();
  const [retryOpen, setRetryOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const { data: d, error, loading, reload } = useApi<Disbursement>(`admin/disbursements/${id}`);
  const act = useAction(reload);

  if (loading && !d) return <Loading what="payout" />;
  if (error?.status === 404 || error?.status === 422) return <NotFoundState what="Payout" backHref="/disbursements" backLabel="Back to payouts" />;
  if (!d) return <ErrorNote error={error} />;

  const canRetry = ["FAILED", "REVERSED"].includes(d.status) && can("DISBURSEMENT_RETRY");
  const canRecheck = ["PROCESSING", "REQUIRES_REVIEW"].includes(d.status) && can("DISBURSEMENT_EXECUTE");

  return (
    <>
      <PageHeader crumbs={[{ label: "Disbursements", href: "/disbursements" }, { label: d.id.slice(0, 8) }]}
        title={money(d.amount)} badge={<StatusBadge status={d.status} />} description={`To ${d.account_number_masked} · ${d.ifsc}`} />
      <div className="mb-4 space-y-3"><ErrorNote error={act.error} />{note && <Notice tone="brand">{note}</Notice>}</div>

      {d.status === "REQUIRES_REVIEW" && <div className="mb-4"><Notice tone="bad"><strong>Needs a human.</strong> The provider&apos;s answers conflict or never settled{d.review_reason ? ` (${humanize(d.review_reason)})` : ""}. Re-check with the provider before doing anything else; never pay again by hand.</Notice></div>}

      <DetailLayout
        main={
          <>
            <Card title="Payout">
              <DefList items={[
                { label: "Amount", value: <span className="num">{money(d.amount)} {d.currency}</span> },
                { label: "Account", value: <span className="num">{d.account_number_masked}</span> },
                { label: "Attempt", value: d.attempt },
                { label: "Provider", value: d.provider },
                { label: "Provider reference", value: <span className="num">{d.provider_ref ?? "—"}</span> },
                { label: "UTR", value: <span className="num">{d.utr ?? "—"}</span> },
                { label: "Requested", value: fmtDateTime(d.requested_at) },
                { label: "Dispatched", value: d.dispatched_at ? fmtDateTime(d.dispatched_at) : "—" },
                { label: "Last checked", value: d.last_polled_at ? fmtDateTime(d.last_polled_at) : "—" },
                { label: "Completed", value: d.completed_at ? fmtDateTime(d.completed_at) : "—" },
                { label: "Failure code", value: d.failure_code ?? "—" },
                { label: "Dispatch attempts", value: d.dispatch_attempts },
              ]} />
            </Card>
            <Card title="Provider events" description="Every webhook, kept and de-duplicated by the provider's event id.">
              {(d.events ?? []).length === 0 ? <p className="text-sm text-muted">No provider events yet.</p> : (
                <Timeline items={(d.events ?? []).map((e) => ({ title: `${humanize(e.reported_status)} → ${humanize(e.outcome)}`, meta: `${fmtDateTime(e.received_at)} · ${e.provider_event_id}` }))} />
              )}
            </Card>
          </>
        }
        side={
          <>
            <Card title="Actions">
              <div className="flex flex-col gap-2">
                {canRecheck && <Button variant="primary" disabled={act.busy} onClick={async () => { setNote(null); await act.run(async () => { const r = await api.post<{ outcome: string }>(`admin/disbursements/${id}/recheck`); setNote(`Provider re-check: ${humanize(r.outcome)}.`); }); }}>Re-check with provider</Button>}
                {canRetry && <Button variant="danger" disabled={act.busy} onClick={() => setRetryOpen(true)}>Retry payout…</Button>}
                {!canRetry && !canRecheck && <p className="text-sm text-muted">{["SUCCESS", "PENDING"].includes(d.status) ? "Nothing to do." : "Only finance can act on payouts."}</p>}
              </div>
              <p className="mt-3 text-xs text-muted">Retry first asks the provider whether the previous attempt really did not pay, then uses a new idempotency key.</p>
            </Card>
            <Card title="Related">
              <Link href={`/offers/${d.loan_offer_id}`} className="text-sm font-medium text-brand-700 hover:underline">Open offer</Link><br />
              <Link href={`/applications/${d.loan_application_id}`} className="text-sm font-medium text-brand-700 hover:underline">Open application</Link>
            </Card>
          </>
        }
      />
      <ReasonDialog open={retryOpen} title="Retry this payout" description="Recorded in the audit log. The provider is asked first; if it reports the money moved, nothing is re-sent." confirmLabel="Retry payout" tone="danger"
        onClose={() => setRetryOpen(false)} onConfirm={async (reason) => { if (await act.run(() => api.post(`admin/disbursements/${id}/retry`, { reason }))) setRetryOpen(false); }} />
    </>
  );
}
