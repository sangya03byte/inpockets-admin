"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Card, DefList, DetailLayout, NotFoundState, Notice, PageHeader, ReasonDialog, StatusBadge, type Tone } from "@/components/ui";
import { customerName, getFraud, type FraudCase } from "@/lib/mock";
import { fmtDateTime } from "@/lib/format";

type Action = "clear" | "escalate" | "confirm" | null;

export default function FraudDetailPage() {
  const { fraudId } = useParams<{ fraudId: string }>();
  const base = getFraud(fraudId);
  const [state, setState] = useState<FraudCase["state"] | null>(null);
  const [action, setAction] = useState<Action>(null);
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null);

  if (!base) return <NotFoundState what="Fraud case" backHref="/fraud" backLabel="Back to fraud review" />;

  const f: FraudCase = { ...base, state: state ?? base.state };
  const open = f.state !== "CLEARED";

  const finish = (next: FraudCase["state"], text: string, tone: Tone) => {
    setState(next);
    setNotice({ tone, text });
    setAction(null);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Fraud review", href: "/fraud" }, { label: f.id }]}
        title={f.id}
        badge={<StatusBadge status={f.state} />}
        description={`${customerName(f.customerId)} · raised ${fmtDateTime(f.raised)}`}
      />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <DetailLayout
        main={
          <>
            <Card title="Signals" description="What triggered this review.">
              <ul className="space-y-3">
                {f.signals.map((s) => (
                  <li key={s} className="wrap-any flex gap-3 text-sm text-body">
                    <span className={`mt-1.5 size-2 shrink-0 rounded-full ${f.band === "HIGH" ? "bg-bad" : f.band === "MEDIUM" ? "bg-[#e39a2d]" : "bg-ok"}`} />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>

            <Card title="Device and links">
              <DefList
                cols={2}
                items={[
                  { label: "Device ID", value: f.deviceId },
                  { label: "Risk band", value: <StatusBadge status={f.band} /> },
                  {
                    label: "Other accounts on this device",
                    value: f.linkedAccounts.length ? (
                      <span className="flex flex-wrap gap-x-3">
                        {f.linkedAccounts.map((id) => (
                          <Link key={id} href={`/customers/${id}`} className="text-brand-700 hover:underline">{customerName(id)} ({id})</Link>
                        ))}
                      </span>
                    ) : (
                      "None"
                    ),
                  },
                  { label: "Application", value: <Link href={`/applications/${f.applicationId}`} className="text-brand-700 hover:underline">{f.applicationId}</Link> },
                ]}
              />
            </Card>
          </>
        }
        side={
          <Card title="Decision">
            {open ? (
              <div className="space-y-2">
                <Button variant="success" className="w-full" onClick={() => setAction("clear")}>Clear case</Button>
                {f.state !== "ESCALATED" && <Button className="w-full" onClick={() => setAction("escalate")}>Escalate</Button>}
                <Button variant="danger" className="w-full" onClick={() => setAction("confirm")}>Confirm fraud and block</Button>
                <p className="pt-2 text-xs text-muted">Blocking suspends the customer and rejects open applications. It is recorded with your reason.</p>
              </div>
            ) : (
              <p className="text-sm text-muted">This case is cleared. The decision stays in the audit log.</p>
            )}
          </Card>
        }
      />

      <ReasonDialog open={action === "clear"} title="Clear fraud case" description="Use when the signals have an innocent explanation." confirmLabel="Clear case" tone="success" reasonLabel="What did you find?" onClose={() => setAction(null)} onConfirm={() => finish("CLEARED", `${f.id} cleared.`, "ok")} />
      <ReasonDialog open={action === "escalate"} title="Escalate fraud case" confirmLabel="Escalate" reasonLabel="Why is this being escalated?" onClose={() => setAction(null)} onConfirm={() => finish("ESCALATED", `${f.id} escalated for senior review.`, "warn")} />
      <ReasonDialog open={action === "confirm"} title="Confirm fraud and block customer" description="This suspends the customer and rejects open applications." confirmLabel="Confirm and block" tone="danger" reasonLabel="Evidence summary" onClose={() => setAction(null)} onConfirm={() => finish("ESCALATED", `${f.id} confirmed as fraud. Customer suspension has been requested.`, "bad")} />
    </>
  );
}
