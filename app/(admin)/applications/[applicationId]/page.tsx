"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import {
  Badge, Button, Card, DefList, Dialog, Field, inputClass, LinkButton, NotFoundState, Notice, PageHeader,
  ReasonDialog, StatusBadge, Timeline, DetailLayout, type Tone,
} from "@/components/ui";
import { Icon } from "@/components/Icon";
import { auditEvents, customerName, getApplication, getCustomer, kycRecords, PIPELINE, type Application } from "@/lib/mock";
import { fmtDateTime, humanize, inr } from "@/lib/format";

type Action = "approve" | "reject" | "info" | "escalate" | null;

const DIM_DOT: Record<string, string> = { ok: "bg-ok", warn: "bg-[#e39a2d]", bad: "bg-bad", neutral: "bg-faint" };

export default function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const base = getApplication(applicationId);
  const [override, setOverride] = useState<Partial<Application> | null>(null);
  const [action, setAction] = useState<Action>(null);
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null);

  if (!base) return <NotFoundState what="Application" backHref="/applications" backLabel="Back to applications" />;

  const app: Application = { ...base, ...override };
  const customer = getCustomer(app.customerId);
  const kyc = kycRecords.find((k) => k.customerId === app.customerId);
  const reviewable = app.state === "MANUAL_REVIEW" || app.state === "PENDING_INFORMATION";
  const history = auditEvents.filter((e) => e.entityId === app.id);
  const band = app.risk.band;

  function done(text: string, state: Application["state"], router: Application["router"], tone: Tone = "ok", stage?: number) {
    setOverride({ state, router, stage: stage ?? app.stage });
    setNotice({ tone, text });
    setAction(null);
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Applications", href: "/applications" }, { label: app.id }]}
        title={app.id}
        badge={<StatusBadge status={app.state} />}
        description={
          <>
            {customerName(app.customerId)} · submitted via {app.channel}
          </>
        }
        actions={<LinkButton href={`/customers/${app.customerId}`}>View customer</LinkButton>}
      />

      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      {/* Pipeline: where this application is on the way to money in the customer's account. */}
      <Card className="mb-6">
        <ol className="grid grid-cols-7 gap-2" aria-label="Lending pipeline">
          {PIPELINE.map((step, i) => {
            const complete = i < app.stage || (app.state === "APPROVED" && i <= app.stage);
            const current = i === app.stage && !complete && app.state !== "REJECTED";
            const rejectedHere = app.state === "REJECTED" && i === app.stage;
            return (
              <li key={step} className="min-w-0">
                <div className={`mb-2 h-1 rounded-full ${rejectedHere ? "bg-bad" : complete ? "bg-brand-500" : current ? "bg-brand-300" : "bg-brand-100"}`} />
                <p className={`truncate text-xs ${current || rejectedHere ? "font-semibold text-ink" : complete ? "text-body" : "text-faint"}`}>{step}</p>
                <p className="truncate text-[11px] text-muted">{rejectedHere ? "Rejected" : complete ? "Done" : current ? "In progress" : "Not started"}</p>
              </li>
            );
          })}
        </ol>
      </Card>

      <DetailLayout
        main={
          <>
            {/* Requested vs eligible, the number a reviewer decides on */}
            <Card>
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-6">
                <div className="min-w-0">
                  <p className="text-xs text-muted">Requested</p>
                  <p className="num mt-1 font-display text-3xl font-semibold text-ink">{inr(app.requested)}</p>
                  <p className="mt-1 text-xs text-muted">{app.tenureMonths} {app.tenureMonths === 1 ? "month" : "months"}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted">System eligible</p>
                  <p className={`num mt-1 font-display text-3xl font-semibold ${app.eligible < app.requested ? "text-warn" : "text-ink"}`}>{app.eligible > 0 ? inr(app.eligible) : "None"}</p>
                  {app.eligible > 0 && app.eligible < app.requested && <p className="mt-1 text-xs text-warn">{inr(app.requested - app.eligible)} above policy</p>}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted">Recommended level</p>
                  <p className="mt-1 font-display text-3xl font-semibold text-ink">{app.recommendedLevel}</p>
                  <p className="mt-1 text-xs text-muted">Policy {app.policyVersion}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted">Router result</p>
                  <div className="mt-2"><StatusBadge status={app.router} /></div>
                  <p className="wrap-any mt-2 text-xs text-muted">Purpose: {app.purpose}</p>
                </div>
              </div>
            </Card>

            <Card title="Risk assessment" description="Higher score means higher risk. Every score comes with the reasons behind it.">
              <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-8">
                <div>
                  <p className="num font-display text-5xl font-semibold leading-none text-ink">{app.risk.score ?? "—"}</p>
                  <div className="mt-3">{band ? <StatusBadge status={band} /> : <Badge tone="brand">Awaiting bureau</Badge>}</div>
                  {app.risk.score !== null && (
                    <div className="mt-4" aria-hidden="true">
                      <div className="relative h-2 rounded-full bg-gradient-to-r from-[#bfe6d4] via-[#f5d9aa] to-[#f6c5c2]">
                        <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow" style={{ left: `${app.risk.score}%` }} />
                      </div>
                      <div className="mt-1 flex justify-between text-[10px] text-faint"><span>0</span><span>100</span></div>
                    </div>
                  )}
                </div>
                <dl className="grid grid-cols-3 gap-x-6 gap-y-4">
                  {app.risk.dimensions.map((d) => (
                    <div key={d.name} className="min-w-0">
                      <dt className="text-xs text-muted">{d.name}</dt>
                      <dd className="mt-0.5 flex items-center gap-2 text-sm font-medium text-ink">
                        <span className={`size-2 shrink-0 rounded-full ${DIM_DOT[d.tone]}`} />
                        <span className="truncate">{d.value}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-6 border-t border-line pt-5">
                <SignalList title="Positive signals" tone="ok" items={app.risk.positives} empty="None recorded" />
                <SignalList title="Review signals" tone="warn" items={app.risk.warnings} empty="None" />
                <SignalList title="Critical flags" tone="bad" items={app.risk.critical} empty="None" />
              </div>
            </Card>

            <Card title="Customer and verification">
              <DefList
                cols={3}
                items={[
                  { label: "Customer", value: <Link href={`/customers/${app.customerId}`} className="text-brand-700 hover:underline">{customerName(app.customerId)}</Link> },
                  { label: "Customer ID", value: app.customerId },
                  { label: "City", value: customer?.city },
                  { label: "KYC", value: customer ? <StatusBadge status={customer.kyc} /> : "—" },
                  { label: "PAN", value: kyc ? <StatusBadge status={kyc.pan} /> : "—" },
                  { label: "Liveness", value: kyc ? <StatusBadge status={kyc.liveness} /> : "—" },
                  { label: "Current level", value: customer?.level },
                  { label: "Device", value: customer?.device },
                  { label: "KYC record", value: kyc ? <Link href={`/kyc/${kyc.id}`} className="text-brand-700 hover:underline">{kyc.id}</Link> : "—" },
                ]}
              />
            </Card>

            <Card title="Decision record" description="Stored with the decision. Later policy changes never rewrite it.">
              <DefList
                cols={3}
                items={[
                  { label: "Policy version", value: app.policyVersion },
                  { label: "Risk model", value: app.modelVersion },
                  { label: "Submitted", value: fmtDateTime(app.submitted) },
                  { label: "Assigned to", value: app.assignedTo },
                  { label: "Router result", value: humanize(app.router) },
                  { label: "Current state", value: humanize(app.state) },
                ]}
              />
            </Card>

            <Card title="Activity">
              {history.length === 0 ? (
                <p className="text-sm text-muted">No reviewer activity yet.</p>
              ) : (
                <Timeline items={history.map((e) => ({ title: humanize(e.action), meta: `${e.actor} · ${fmtDateTime(e.at)}`, body: e.reason !== "—" ? e.reason : undefined }))} />
              )}
            </Card>
          </>
        }
        side={
          <Card title="Decision">
            {reviewable ? (
              <>
                <p className="text-sm text-muted">System recommendation</p>
                <p className="mt-1 text-sm font-medium text-ink">
                  {humanize(app.router)}
                  {app.eligible > 0 && <> · up to {inr(app.eligible)} at {app.recommendedLevel}</>}
                </p>
                {band && (
                  <p className="mt-2 text-xs text-muted">
                    Overall risk is <span className={`font-medium ${band === "HIGH" ? "text-bad" : band === "MEDIUM" ? "text-warn" : "text-ok"}`}>{band.toLowerCase()}</span>.
                  </p>
                )}
                <div className="mt-5 space-y-2">
                  <Button variant="primary" className="w-full" onClick={() => setAction("approve")}><Icon name="check" size={16} />Approve</Button>
                  <Button variant="secondary" className="w-full" onClick={() => setAction("info")}>Request information</Button>
                  <Button variant="secondary" className="w-full" onClick={() => setAction("escalate")}>Escalate</Button>
                  <Button variant="danger" className="w-full" onClick={() => setAction("reject")}>Reject</Button>
                </div>
                <p className="mt-5 flex gap-2 rounded-lg bg-brand-50 p-3 text-xs text-muted">
                  <Icon name="lock" size={14} className="mt-0.5 shrink-0 text-brand-500" />
                  <span>Approval does not disburse. The customer still needs to accept the offer, sign, and have a verified bank account. A finance user then releases the payout.</span>
                </p>
              </>
            ) : app.state === "PENDING_EXTERNAL_PROVIDER" ? (
              <p className="text-sm text-muted">Waiting for the credit bureau response. Decision actions unlock when risk and policy are evaluated. The job retries automatically.</p>
            ) : app.state === "APPROVED" ? (
              <>
                <p className="text-sm text-ink">Approved under policy {app.policyVersion}.</p>
                <p className="mt-2 text-sm text-muted">Next: offer and KFS, customer e-sign, bank verification, then manual payout release.</p>
                <div className="mt-4"><LinkButton href="/disbursements" variant="secondary">Open disbursements</LinkButton></div>
              </>
            ) : (
              <p className="text-sm text-muted">This application was rejected. The decision, reasons and policy version are kept in the audit log.</p>
            )}
          </Card>
        }
      />

      {action === "approve" && (
        <ApproveDialog
          app={app}
          onClose={() => setAction(null)}
          onConfirm={(amount) => done(`Approved ${inr(amount)} for ${app.id}. The customer will be shown an offer; no money moves until the payout is released.`, "APPROVED", "AUTO_APPROVE", "ok", 3)}
        />
      )}
      <ReasonDialog open={action === "reject"} title="Reject application" description={`${app.id} · ${customerName(app.customerId)}`} confirmLabel="Reject application" tone="danger" reasonLabel="Reason for rejection" reasonHint="Shown to compliance. The customer sees a plain-language summary only." onClose={() => setAction(null)} onConfirm={() => done(`${app.id} rejected. Reason saved to the audit log.`, "REJECTED", "AUTO_REJECT", "bad")} />
      <ReasonDialog open={action === "info"} title="Request more information" description="The customer is notified in the app and by SMS." confirmLabel="Send request" reasonLabel="What is needed?" reasonHint="For example: last 3 months of bank statements." onClose={() => setAction(null)} onConfirm={() => done(`Information requested for ${app.id}. The application moves to pending information.`, "PENDING_INFORMATION", "PENDING_INFORMATION", "brand")} />
      <ReasonDialog open={action === "escalate"} title="Escalate to senior underwriter" confirmLabel="Escalate" reasonLabel="Why is this being escalated?" onClose={() => setAction(null)} onConfirm={() => done(`${app.id} escalated to a senior underwriter.`, "MANUAL_REVIEW", "MANUAL_REVIEW", "warn")} />
    </>
  );
}

function SignalList({ title, tone, items, empty }: { title: string; tone: Tone; items: string[]; empty: string }) {
  const dot: Record<string, string> = { ok: "bg-ok", warn: "bg-[#e39a2d]", bad: "bg-bad" };
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-medium text-muted">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-faint">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((s) => (
            <li key={s} className="wrap-any flex gap-2 text-sm text-body">
              <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dot[tone]}`} />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ApproveDialog({ app, onClose, onConfirm }: { app: Application; onClose: () => void; onConfirm: (amount: number) => void }) {
  const [amount, setAmount] = useState(String(app.eligible));
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  const value = Number(amount);
  const overPolicy = value > app.eligible;
  const amountError = !Number.isFinite(value) || value <= 0 ? "Enter an amount greater than zero." : overPolicy ? `Above the policy maximum of ${inr(app.eligible)}. Use Escalate to request an override.` : "";
  const reasonError = reason.trim().length < 5 ? "Enter a reason of at least 5 characters." : "";

  function submit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (amountError || reasonError) return;
    onConfirm(value);
  }

  return (
    <Dialog open onClose={onClose} title="Approve application" description={`${app.id} · ${customerName(app.customerId)}`}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Approved amount (₹)" hint={`Policy maximum for this customer: ${inr(app.eligible)}`}>
          <input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))} aria-invalid={touched && !!amountError} className={`${inputClass} num aria-[invalid=true]:ring-bad`} />
        </Field>
        {touched && amountError && <p className="-mt-2 text-xs text-bad">{amountError}</p>}
        <Field label="Reason" hint="Recorded in the audit log with your name and role.">
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} aria-invalid={touched && !!reasonError} className="w-full resize-none rounded-lg bg-surface px-3 py-2.5 text-sm text-ink ring-1 ring-inset ring-line-strong focus:ring-2 focus:ring-brand-500 aria-[invalid=true]:ring-bad" />
        </Field>
        {touched && reasonError && <p className="-mt-2 text-xs text-bad">{reasonError}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Approve {Number.isFinite(value) && value > 0 ? inr(value) : ""}</Button>
        </div>
      </form>
    </Dialog>
  );
}
