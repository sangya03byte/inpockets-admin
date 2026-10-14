"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, DefList, DetailLayout, Meter, NotFoundState, Notice, PageHeader, ReasonDialog, StatusBadge, type Tone } from "@/components/ui";
import { customerName, getCustomer, getKyc, type KycRecord } from "@/lib/mock";
import { fmtDateTime, humanize } from "@/lib/format";

type Action = "verify" | "fail" | "retry" | null;

export default function KycDetailPage() {
  const { kycId } = useParams<{ kycId: string }>();
  const base = getKyc(kycId);
  const [state, setState] = useState<KycRecord["state"] | null>(null);
  const [action, setAction] = useState<Action>(null);
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null);

  if (!base) return <NotFoundState what="KYC record" backHref="/kyc" backLabel="Back to KYC review" />;

  const k: KycRecord = { ...base, state: state ?? base.state };
  const customer = getCustomer(k.customerId);
  const open = k.state === "MANUAL_REVIEW";

  const finish = (next: KycRecord["state"], text: string, tone: Tone) => {
    setState(next);
    setNotice({ tone, text });
    setAction(null);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "KYC review", href: "/kyc" }, { label: k.id }]}
        title={k.id}
        badge={<StatusBadge status={k.state} />}
        description={`${customerName(k.customerId)} · submitted ${fmtDateTime(k.submitted)}`}
      />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <DetailLayout
        main={
          <>
            <Card title="Verification steps" description="Each step is verified separately, then combined into the overall result.">
              <ul className="divide-y divide-line">
                {[
                  { name: "PAN verification", status: k.pan, detail: "Name and date of birth checked against the PAN provider." },
                  { name: "DigiLocker identity", status: k.digilocker, detail: `Provider: ${k.provider}. Only the verified fields are kept.` },
                  { name: "Liveness check", status: k.liveness, detail: "Live camera capture checked for presence and spoofing." },
                ].map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-6 py-3.5 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{s.name}</p>
                      <p className="wrap-any text-xs text-muted">{s.detail}</p>
                    </div>
                    <StatusBadge status={s.status} />
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Face match">
              {k.faceMatch === null ? (
                <p className="text-sm text-muted">Not available yet. Face matching runs after liveness passes.</p>
              ) : (
                <div className="max-w-md">
                  <div className="mb-2 flex items-baseline justify-between">
                    <p className="num font-display text-3xl font-semibold text-ink">{k.faceMatch}%</p>
                    <p className="text-xs text-muted">Auto-approve confidence is set by the provider</p>
                  </div>
                  <Meter value={k.faceMatch} tone={k.faceMatch >= 90 ? "ok" : k.faceMatch >= 80 ? "warn" : "bad"} label="Face match confidence" />
                </div>
              )}
            </Card>

            <Card title="Why this needs a person">
              <p className="wrap-any text-sm text-body">{k.flag === "None" ? "No exceptions were raised for this record." : k.flag}</p>
              <DefList
                cols={3}
                items={[
                  { label: "Attempts", value: k.attempts },
                  { label: "Provider", value: k.provider },
                  { label: "Overall state", value: humanize(k.state) },
                ]}
              />
            </Card>
          </>
        }
        side={
          <>
            <Card title="Customer">
              <DefList
                cols={1}
                items={[
                  { label: "Name", value: <Link href={`/customers/${k.customerId}`} className="text-brand-700 hover:underline">{customerName(k.customerId)}</Link> },
                  { label: "PAN (masked)", value: customer?.pan },
                  { label: "Date of birth", value: customer?.dob },
                ]}
              />
            </Card>
            <Card title="Decision">
              {open ? (
                <div className="space-y-2">
                  <Button variant="primary" className="w-full" onClick={() => setAction("verify")}>Mark as verified</Button>
                  <Button className="w-full" onClick={() => setAction("retry")}>Ask customer to retry</Button>
                  <Button variant="danger" className="w-full" onClick={() => setAction("fail")}>Mark as failed</Button>
                </div>
              ) : (
                <p className="text-sm text-muted">{k.state === "VERIFIED" ? "This record is verified. No action needed." : "Waiting for the provider. Actions unlock if it needs manual review."}</p>
              )}
            </Card>
          </>
        }
      />

      <ReasonDialog open={action === "verify"} title="Mark KYC as verified" description="Use only when documents were checked and the mismatch is explained." confirmLabel="Mark verified" tone="success" reasonLabel="What did you check?" onClose={() => setAction(null)} onConfirm={() => finish("VERIFIED", `${k.id} marked verified. Logged with your reason.`, "ok")} />
      <ReasonDialog open={action === "retry"} title="Ask customer to retry" confirmLabel="Send retry request" reasonLabel="What should the customer fix?" onClose={() => setAction(null)} onConfirm={() => finish("PENDING", `Retry requested for ${k.id}. The customer is notified in the app.`, "brand")} />
      <ReasonDialog open={action === "fail"} title="Mark KYC as failed" description="The customer cannot continue to a loan until KYC passes." confirmLabel="Mark failed" tone="danger" reasonLabel="Reason" onClose={() => setAction(null)} onConfirm={() => finish("FAILED", `${k.id} marked failed.`, "bad")} />
    </>
  );
}
