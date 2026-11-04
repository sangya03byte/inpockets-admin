"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Badge, Button, Card, DefList, DetailLayout, Dialog, Field, NotFoundState, Notice, PageHeader, ReasonDialog, StatusBadge, Timeline, inputClass,
} from "@/components/ui";
import { ErrorNote, Loading, money, useAction } from "@/components/live";
import { api } from "@/lib/api";
import { fmtDateTime, humanize } from "@/lib/format";
import { useSession } from "@/lib/session";
import type { AppEvent, Application, Customer, Decision, Offer } from "@/lib/types";
import { useApi } from "@/lib/use-api";

type Dlg = null | "approve" | "reject" | "info" | "offer";

export default function ApplicationDetail() {
  const { applicationId: id } = useParams<{ applicationId: string }>();
  const { can } = useSession();
  const [dlg, setDlg] = useState<Dlg>(null);

  const app = useApi<Application>(`admin/loan-applications/${id}`);
  const events = useApi<AppEvent[]>(`admin/loan-applications/${id}/events`);
  const decision = useApi<Decision>(`admin/loan-applications/${id}/decision`);
  const customer = useApi<Customer>(app.data ? `admin/customers/${app.data.user_id}` : null);
  const offers = useApi<Offer[]>(`admin/loan-offers?loan_application_id=${id}`);

  const reloadAll = () => { app.reload(); events.reload(); decision.reload(); offers.reload(); };
  const act = useAction(reloadAll);

  if (app.loading && !app.data) return <Loading what="application" />;
  if (app.error?.status === 404 || app.error?.status === 422) return <NotFoundState what="Application" backHref="/applications" backLabel="Back to applications" />;
  if (!app.data) return <ErrorNote error={app.error} />;
  const a = app.data;
  const d = decision.data;
  const hasOffer = (offers.data ?? []).some((o) => o.status !== "CANCELLED");

  const post = (path: string, body?: unknown) => act.run(() => api.post(`admin/loan-applications/${id}/${path}`, body));

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Applications", href: "/applications" }, { label: a.application_number }]}
        title={a.application_number}
        badge={<StatusBadge status={a.status} />}
        description={`Requested ${money(a.requested_amount)} for ${a.requested_tenure_days} days`}
      />
      <div className="mb-4 space-y-3"><ErrorNote error={act.error} /></div>

      <DetailLayout
        main={
          <>
            <Card title="Application">
              <DefList items={[
                { label: "Application number", value: <span className="num">{a.application_number}</span> },
                { label: "Status", value: <StatusBadge status={a.status} /> },
                { label: "Requested amount", value: <span className="num">{money(a.requested_amount)}</span> },
                { label: "Requested tenure", value: `${a.requested_tenure_days} days` },
                { label: "Submitted", value: a.submitted_at ? fmtDateTime(a.submitted_at) : "Not submitted" },
                { label: "Created", value: fmtDateTime(a.created_at) },
              ]} />
            </Card>

            <Card title="Decision" description="The recorded, immutable human decision.">
              {d ? (
                <DefList items={[
                  { label: "Decision", value: <Badge tone={d.decision === "APPROVED" ? "ok" : "bad"}>{d.decision}</Badge> },
                  { label: "Approved amount", value: <span className="num">{money(d.approved_amount)}</span> },
                  { label: "Decided", value: fmtDateTime(d.created_at) },
                  { label: "Reason", value: d.reason },
                ]} />
              ) : (
                <p className="text-sm text-muted">No decision has been recorded yet.</p>
              )}
            </Card>

            <Card title="Offers" description="Terms the customer will see in the app once issued.">
              {offers.loading && !offers.data ? <Loading what="offers" /> : (offers.data ?? []).length === 0 ? (
                <p className="text-sm text-muted">No offer yet.{a.status === "APPROVED" ? " Create one from the actions panel." : ""}</p>
              ) : (
                <ul className="divide-y divide-line">
                  {offers.data!.map((o) => (
                    <li key={o.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink"><span className="num">{money(o.principal_amount)}</span> · {o.tenure_days} days · v{o.version}</p>
                        <p className="text-xs text-muted">Created {fmtDateTime(o.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={o.effective_status ?? o.status} />
                        <Link href={`/offers/${o.id}`} className="text-sm font-medium text-brand-700 hover:underline">Open</Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="History">
              {events.loading && !events.data ? <Loading what="history" /> : (
                <Timeline items={(events.data ?? []).map((e) => ({
                  title: `${humanize(e.event_type)}${e.new_status ? ` → ${humanize(e.new_status)}` : ""}`,
                  meta: `${fmtDateTime(e.created_at)} · ${humanize(e.actor_type)}`,
                  body: e.reason ?? undefined,
                  tone: e.new_status === "REJECTED" ? "bad" : e.new_status === "APPROVED" ? "ok" : "brand",
                }))} />
              )}
            </Card>
          </>
        }
        side={
          <>
            <Card title="Actions">
              <div className="flex flex-col gap-2">
                {a.status === "SUBMITTED" && can("LOAN_APPLICATION_REVIEW") && <Button variant="primary" disabled={act.busy} onClick={() => post("process")}>Pick up for processing</Button>}
                {a.status === "PROCESSING" && can("LOAN_APPLICATION_REVIEW") && <Button variant="primary" disabled={act.busy} onClick={() => post("start-review")}>Start manual review</Button>}
                {["PROCESSING", "MANUAL_REVIEW"].includes(a.status) && (
                  <>
                    {can("LOAN_APPROVE") && <Button variant="success" disabled={act.busy} onClick={() => setDlg("approve")}>Approve…</Button>}
                    {can("LOAN_REJECT") && <Button variant="danger" disabled={act.busy} onClick={() => setDlg("reject")}>Reject…</Button>}
                    {can("LOAN_APPLICATION_REVIEW") && <Button disabled={act.busy} onClick={() => setDlg("info")}>Ask customer for information…</Button>}
                  </>
                )}
                {a.status === "APPROVED" && !hasOffer && can("LOAN_APPLICATION_REVIEW") && <Button variant="primary" disabled={act.busy} onClick={() => setDlg("offer")}>Create offer…</Button>}
                {["REJECTED", "CANCELLED", "EXPIRED", "DRAFT"].includes(a.status) && <p className="text-sm text-muted">No actions available in this status.</p>}
                {!["APPROVED", "REJECTED", "CANCELLED", "EXPIRED", "DRAFT"].includes(a.status) && !can("LOAN_APPLICATION_REVIEW") && !can("LOAN_APPROVE") && <p className="text-sm text-muted">Your role cannot act on this application.</p>}
              </div>
              {["PROCESSING", "MANUAL_REVIEW"].includes(a.status) && !can("LOAN_APPROVE") && can("LOAN_REJECT") && (
                <p className="mt-3 text-xs text-muted">Your role can reject but not approve. A senior underwriter makes approvals.</p>
              )}
            </Card>

            <Card title="Customer">
              {customer.data ? (
                <>
                  <DefList cols={1} items={[
                    { label: "Name", value: [customer.data.first_name, customer.data.last_name].filter(Boolean).join(" ") || "—" },
                    { label: "Mobile", value: customer.data.phone_number },
                    { label: "PAN", value: customer.data.pan_number_masked ?? "—" },
                    { label: "PAN / KYC / identity", value: [customer.data.pan_status, customer.data.kyc_status, customer.data.identity_verification_status].map((s) => (s ? humanize(s) : "—")).join(" · ") },
                  ]} />
                  <Link href={`/customers/${customer.data.customer_id}`} className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline">Open customer</Link>
                </>
              ) : customer.error ? <ErrorNote error={customer.error} /> : <Loading what="customer" />}
            </Card>
          </>
        }
      />

      {dlg === "approve" && <ApproveDialog open requested={a.requested_amount} busy={act.busy} onClose={() => setDlg(null)}
        onConfirm={async (amount, reason) => { if (await post("approve", { approved_amount: amount, reason })) setDlg(null); }} />}
      <ReasonDialog open={dlg === "reject"} title="Reject this application" description="The customer is told the application was not approved. The reason is recorded and audited." confirmLabel="Reject application" tone="danger"
        onClose={() => setDlg(null)} onConfirm={async (reason) => { if (await post("reject", { reason })) setDlg(null); }} />
      <ReasonDialog open={dlg === "info"} title="Ask the customer for more information" description="Moves the application to 'pending additional information'." confirmLabel="Request information"
        onClose={() => setDlg(null)} onConfirm={async (reason) => { if (await post("transition", { status: "PENDING_ADDITIONAL_INFORMATION", reason })) setDlg(null); }} />
      {dlg === "offer" && <OfferDialog open requested={a.requested_amount} tenure={a.requested_tenure_days} approved={d?.approved_amount ?? null} busy={act.busy} onClose={() => setDlg(null)}
        onConfirm={async (body) => { if (await act.run(() => api.post("admin/loan-offers", { loan_application_id: id, ...body }))) setDlg(null); }} />}
    </>
  );
}

function ApproveDialog({ open, requested, busy, onClose, onConfirm }: { open: boolean; requested: string; busy: boolean; onClose: () => void; onConfirm: (amount: string, reason: string) => void }) {
  const [amount, setAmount] = useState(requested);
  const [reason, setReason] = useState("");
  return (
    <Dialog open={open} onClose={onClose} title="Approve this application" description="Records an immutable approval decision. You cannot approve more than the customer asked for.">
      <div className="space-y-4">
        <Field label="Approved amount (₹)" hint={`Requested ${money(requested)}`}><input className={inputClass} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
        <Field label="Reason" hint="At least 10 characters. Recorded in the audit log with your name and role."><textarea className={`${inputClass} h-24 py-2`} value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
        <div className="flex justify-end gap-2"><Button onClick={onClose}>Cancel</Button><Button variant="success" disabled={busy || reason.trim().length < 10 || !amount} onClick={() => onConfirm(amount.trim(), reason.trim())}>Approve</Button></div>
      </div>
    </Dialog>
  );
}

function OfferDialog({ open, requested, tenure, approved, busy, onClose, onConfirm }: {
  open: boolean; requested: string; tenure: number; approved: string | null; busy: boolean; onClose: () => void;
  onConfirm: (b: { principal_amount: string; tenure_days: number; commercial_terms: Record<string, string> }) => void;
}) {
  const [principal, setPrincipal] = useState(approved ?? requested);
  const [days, setDays] = useState(String(tenure));
  const [rate, setRate] = useState("");
  const [fee, setFee] = useState("");
  return (
    <Dialog open={open} onClose={onClose} title="Create an offer" description={`Draft only: it is not visible to the customer until a senior underwriter issues it. Maximum ${money(approved ?? requested)} (the approved amount).`}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Principal (₹)"><input className={inputClass} inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} /></Field>
          <Field label="Tenure (days)"><input className={inputClass} inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value.replace(/\D/g, ""))} /></Field>
          <Field label="Interest rate (% p.a.)" hint="Set by lender policy."><input className={inputClass} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
          <Field label="Processing fee (₹)"><input className={inputClass} inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value)} /></Field>
        </div>
        <Notice tone="warn">Interest and fees come from the lender&apos;s policy. This console does not calculate them.</Notice>
        <div className="flex justify-end gap-2"><Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={busy || !principal || !days || !rate} onClick={() => onConfirm({ principal_amount: principal.trim(), tenure_days: Number(days), commercial_terms: { interest_rate: rate.trim(), ...(fee ? { processing_fee: fee.trim() } : {}) } })}>Create draft</Button></div>
      </div>
    </Dialog>
  );
}
