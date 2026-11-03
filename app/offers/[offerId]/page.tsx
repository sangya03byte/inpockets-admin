"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, DefList, DetailLayout, NotFoundState, Notice, PageHeader, ReasonDialog, StatusBadge, Timeline } from "@/components/ui";
import { ErrorNote, Loading, money, useAction } from "@/components/live";
import { api } from "@/lib/api";
import { fmtDateTime, humanize } from "@/lib/format";
import { useSession } from "@/lib/session";
import type { BankVerification, Disbursement, ESignAdmin, Offer } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export default function OfferDetail() {
  const { offerId: id } = useParams<{ offerId: string }>();
  const { can } = useSession();
  const [cancelOpen, setCancelOpen] = useState(false);

  const offer = useApi<Offer>(`admin/loan-offers/${id}`);
  const esign = useApi<ESignAdmin>(`admin/loan-offers/${id}/esign`);
  const bank = useApi<BankVerification[]>(offer.data ? `admin/bank-verifications/users/${offer.data.user_id}` : null);
  const payouts = useApi<Disbursement[]>(can("DISBURSEMENT_READ") || can("DISBURSEMENT_EXECUTE") ? `admin/disbursements?loan_offer_id=${id}` : null);

  const reload = () => { offer.reload(); esign.reload(); bank.reload(); payouts.reload(); };
  const act = useAction(reload);

  if (offer.loading && !offer.data) return <Loading what="offer" />;
  if (offer.error?.status === 404 || offer.error?.status === 422) return <NotFoundState what="Offer" backHref="/applications" backLabel="Back to applications" />;
  if (!offer.data) return <ErrorNote error={offer.error} />;
  const o = offer.data;
  const status = o.effective_status ?? o.status;
  const signed = esign.data?.status === "SIGNED";
  const verified = (bank.data ?? []).find((b) => b.status === "VERIFIED" && !("superseded_at" in b && (b as { superseded_at?: string | null }).superseded_at));
  const payout = (payouts.data ?? []).find((p) => !["FAILED", "REVERSED"].includes(p.status)) ?? (payouts.data ?? [])[0];
  const canPay = status === "ACCEPTED" && signed && !!verified && !payout && can("DISBURSEMENT_EXECUTE");

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Applications", href: "/applications" }, { label: "Application", href: `/applications/${o.loan_application_id}` }, { label: `Offer v${o.version}` }]}
        title={`Offer v${o.version}`}
        badge={<StatusBadge status={status} />}
        description={`${money(o.principal_amount)} for ${o.tenure_days} days`}
      />
      <div className="mb-4"><ErrorNote error={act.error} /></div>

      <DetailLayout
        main={
          <>
            <Card title="Terms">
              <DefList items={[
                { label: "Principal", value: <span className="num">{money(o.principal_amount)}</span> },
                { label: "Tenure", value: `${o.tenure_days} days` },
                ...Object.entries(o.commercial_terms ?? {}).map(([k, v]) => ({ label: humanize(k), value: <span className="num">{v}</span> })),
                { label: "Issued", value: o.issued_at ? fmtDateTime(o.issued_at) : "Not issued" },
                { label: "Expires", value: o.expires_at ? fmtDateTime(o.expires_at) : "—" },
                { label: "Accepted by customer", value: o.accepted_at ? fmtDateTime(o.accepted_at) : "Not yet" },
              ]} />
            </Card>

            <Card title="E-sign" description="The agreement is signed through the e-sign provider; only its signed callback marks it signed.">
              {esign.error && esign.error.status !== 404 ? <ErrorNote error={esign.error} /> : esign.data ? (
                <>
                  <DefList items={[
                    { label: "Status", value: <StatusBadge status={esign.data.status} /> },
                    { label: "Provider", value: esign.data.provider },
                    { label: "Signed", value: esign.data.signed_at ? fmtDateTime(esign.data.signed_at) : "—" },
                    { label: "Expires", value: fmtDateTime(esign.data.expires_at) },
                  ]} />
                  {esign.data.failure_reason && <div className="mt-3"><Notice tone="bad">{esign.data.failure_reason}</Notice></div>}
                </>
              ) : <p className="text-sm text-muted">The customer has not started e-sign.</p>}
            </Card>

            <Card title="Bank account" description="Verified before any payout. Account numbers are always masked.">
              {bank.data && bank.data.length > 0 ? (
                <ul className="divide-y divide-line">
                  {bank.data.map((b) => (
                    <li key={b.id} className="flex items-center justify-between py-3">
                      <div><p className="num text-sm font-medium text-ink">{b.account_number_masked}</p><p className="text-xs text-muted">{b.ifsc}{b.bank_name ? ` · ${b.bank_name}` : ""} · name match {b.name_match_result ? humanize(b.name_match_result) : "pending"}</p></div>
                      <StatusBadge status={b.status} />
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-muted">{bank.loading ? "Loading…" : "The customer has not added a bank account."}</p>}
            </Card>

            <Card title="Payout">
              {payout ? (
                <div className="space-y-3">
                  <DefList items={[
                    { label: "Status", value: <StatusBadge status={payout.status} /> },
                    { label: "Amount", value: <span className="num">{money(payout.amount)}</span> },
                    { label: "UTR", value: payout.utr ?? "—" },
                    { label: "Attempt", value: payout.attempt },
                  ]} />
                  <Link href={`/disbursements/${payout.id}`} className="text-sm font-medium text-brand-700 hover:underline">Open payout</Link>
                </div>
              ) : <p className="text-sm text-muted">No payout has been created.</p>}
            </Card>
          </>
        }
        side={
          <>
            <Card title="Actions">
              <div className="flex flex-col gap-2">
                {status === "DRAFT" && can("LOAN_OFFER_ISSUE") && (
                  <Button variant="primary" disabled={act.busy} onClick={() => act.run(() => api.post(`admin/loan-offers/${id}/issue`))}>Issue to customer</Button>
                )}
                {["DRAFT", "ISSUED"].includes(status) && can("LOAN_OFFER_CANCEL") && <Button variant="danger" disabled={act.busy} onClick={() => setCancelOpen(true)}>Cancel offer…</Button>}
                {canPay && <Button variant="primary" disabled={act.busy} onClick={() => act.run(() => api.post("admin/disbursements", { loan_offer_id: id }))}>Create payout</Button>}
                {status === "DRAFT" && !can("LOAN_OFFER_ISSUE") && <p className="text-sm text-muted">A senior underwriter issues offers.</p>}
                {status === "ACCEPTED" && !canPay && !payout && <p className="text-sm text-muted">{!can("DISBURSEMENT_EXECUTE") ? "Only finance creates payouts." : !signed ? "Waiting for the customer to sign." : "Waiting for a verified bank account."}</p>}
              </div>
            </Card>
            {esign.data && esign.data.events.length > 0 && (
              <Card title="E-sign events">
                <Timeline items={esign.data.events.map((e) => ({ title: humanize(String(e.status ?? e.outcome ?? "event")), meta: e.received_at ? fmtDateTime(e.received_at) : undefined }))} />
              </Card>
            )}
          </>
        }
      />
      <ReasonDialog open={cancelOpen} title="Cancel this offer" description="The customer can no longer accept it." confirmLabel="Cancel offer" tone="danger"
        onClose={() => setCancelOpen(false)} onConfirm={async (reason) => { if (await act.run(() => api.post(`admin/loan-offers/${id}/cancel`, { reason }))) setCancelOpen(false); }} />
    </>
  );
}
