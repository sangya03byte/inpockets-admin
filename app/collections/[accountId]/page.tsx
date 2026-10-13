"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button, Card, DefList, DetailLayout, Dialog, Field, inputClass, NotFoundState, Notice, PageHeader, ReasonDialog, StatusBadge, Timeline, type Tone } from "@/components/ui";
import { customerName, getCase, getLoan, type CollectionCase } from "@/lib/mock";
import { fmtDate, fmtDateTime, inr, NOW_ISO } from "@/lib/format";

type Action = "contact" | "promise" | "escalate" | null;

export default function CollectionDetailPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const base = getCase(accountId);
  const [local, setLocal] = useState<Partial<CollectionCase>>({});
  const [action, setAction] = useState<Action>(null);
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null);

  if (!base) return <NotFoundState what="Collection case" backHref="/collections" backLabel="Back to collections" />;

  const c: CollectionCase = { ...base, ...local, events: [...(local.events ?? base.events)] };
  const loan = getLoan(c.loanId);
  const closed = c.stage === "RESOLVED";

  const addEvent = (channel: string, note: string, patch: Partial<CollectionCase>, text: string) => {
    setLocal({ ...local, ...patch, events: [...c.events, { at: NOW_ISO, channel, note }] });
    setNotice({ tone: "ok", text });
    setAction(null);
  };

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Collections", href: "/collections" }, { label: c.id }]}
        title={c.id}
        badge={<StatusBadge status={c.stage} />}
        description={`${customerName(c.customerId)} · ${c.loanId} · assigned to ${c.agent}`}
        actions={
          !closed && c.dpd > 0 ? (
            <>
              <Button onClick={() => setAction("contact")}>Log contact</Button>
              <Button onClick={() => setAction("promise")}>Record promise to pay</Button>
              {c.stage !== "ESCALATED" && <Button variant="danger" onClick={() => setAction("escalate")}>Escalate</Button>}
            </>
          ) : undefined
        }
      />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <DetailLayout
        main={
          <Card title="Contact history" description="Newest at the bottom. Every call, message and link is recorded.">
            <Timeline items={c.events.map((e) => ({ title: `${e.channel}: ${e.note}`, meta: fmtDateTime(e.at) }))} />
          </Card>
        }
        side={
          <>
            <Card title="Account">
              <DefList
                cols={2}
                items={[
                  { label: "Overdue", value: c.overdue ? inr(c.overdue) : "None" },
                  { label: "Days past due", value: c.dpd || "0" },
                  { label: "Outstanding", value: loan ? inr(loan.outstanding) : "—" },
                  { label: "Promise date", value: fmtDate(c.promiseDate) },
                  { label: "Customer", value: <Link href={`/customers/${c.customerId}`} className="text-brand-700 hover:underline">{customerName(c.customerId)}</Link> },
                  { label: "Loan", value: <Link href={`/loans/${c.loanId}`} className="text-brand-700 hover:underline">{c.loanId}</Link> },
                ]}
              />
            </Card>
            <Card title="Conduct">
              <p className="text-sm text-muted">Contact only through approved channels and within the hours set in the lender&apos;s collections policy. Notes must be factual. Do not record or contact the customer&apos;s phone contacts.</p>
            </Card>
          </>
        }
      />

      {action === "contact" && <ContactDialog onClose={() => setAction(null)} onSave={(channel, note) => addEvent(channel, note, { lastContact: NOW_ISO.slice(0, 10), stage: c.stage === "REMINDER" ? "FOLLOW_UP" : c.stage }, "Contact logged.")} />}
      {action === "promise" && <PromiseDialog onClose={() => setAction(null)} onSave={(date, note) => addEvent("Call", `Promise to pay on ${fmtDate(date)}. ${note}`, { stage: "PROMISE_TO_PAY", promiseDate: date, lastContact: NOW_ISO.slice(0, 10) }, `Promise to pay recorded for ${fmtDate(date)}.`)} />}
      <ReasonDialog open={action === "escalate"} title="Escalate collection case" description="A senior agent takes over. The customer is not contacted by this action." confirmLabel="Escalate" tone="danger" reasonLabel="Why escalate?" onClose={() => setAction(null)} onConfirm={(reason) => addEvent("Internal", `Escalated: ${reason}`, { stage: "ESCALATED" }, `${c.id} escalated.`)} />
    </>
  );
}

function ContactDialog({ onClose, onSave }: { onClose: () => void; onSave: (channel: string, note: string) => void }) {
  const [channel, setChannel] = useState("Call");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const bad = note.trim().length < 5;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!bad) onSave(channel, note.trim());
  };
  return (
    <Dialog open onClose={onClose} title="Log contact">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Channel">
          <select value={channel} onChange={(e) => setChannel(e.target.value)} className={inputClass}>
            {["Call", "SMS", "Email", "Push"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="What happened?" hint={touched && bad ? undefined : "Keep it factual."}>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full resize-none rounded-lg bg-surface px-3 py-2.5 text-sm text-ink ring-1 ring-inset ring-line-strong focus:ring-2 focus:ring-brand-500" />
        </Field>
        {touched && bad && <p className="-mt-2 text-xs text-bad">Enter at least 5 characters.</p>}
        <div className="flex justify-end gap-2"><Button onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Save contact</Button></div>
      </form>
    </Dialog>
  );
}

function PromiseDialog({ onClose, onSave }: { onClose: () => void; onSave: (date: string, note: string) => void }) {
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = !date || date < NOW_ISO.slice(0, 10);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!invalid) onSave(date, note.trim());
  };
  return (
    <Dialog open onClose={onClose} title="Record promise to pay">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Promised date">
          <input type="date" min={NOW_ISO.slice(0, 10)} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </Field>
        {touched && invalid && <p className="-mt-2 text-xs text-bad">Choose today or a later date.</p>}
        <Field label="Note" hint="Optional. For example: payment link shared.">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full resize-none rounded-lg bg-surface px-3 py-2.5 text-sm text-ink ring-1 ring-inset ring-line-strong focus:ring-2 focus:ring-brand-500" />
        </Field>
        <div className="flex justify-end gap-2"><Button onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Save promise</Button></div>
      </form>
    </Dialog>
  );
}
