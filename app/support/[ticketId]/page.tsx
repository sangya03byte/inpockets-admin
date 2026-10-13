"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Avatar, Button, Card, DefList, DetailLayout, NotFoundState, Notice, PageHeader, StatusBadge, type Tone } from "@/components/ui";
import { customerName, getTicket, type Ticket } from "@/lib/mock";
import { fmtDateTime } from "@/lib/format";
import { NOW_ISO } from "@/lib/format";

export default function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const base = getTicket(ticketId);
  const [extra, setExtra] = useState<Ticket["messages"]>([]);
  const [status, setStatus] = useState<Ticket["status"] | null>(null);
  const [reply, setReply] = useState("");
  const [touched, setTouched] = useState(false);
  const [notice, setNotice] = useState<{ tone: Tone; text: string } | null>(null);

  if (!base) return <NotFoundState what="Ticket" backHref="/support" backLabel="Back to support" />;

  const t: Ticket = { ...base, status: status ?? base.status, messages: [...base.messages, ...extra] };
  const closed = t.status === "RESOLVED";
  const invalid = reply.trim().length < 2;

  function send(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (invalid) return;
    setExtra([...extra, { from: "agent", name: "Admin User", at: NOW_ISO, text: reply.trim() }]);
    setStatus("WAITING_ON_CUSTOMER");
    setReply("");
    setTouched(false);
    setNotice({ tone: "ok", text: "Reply sent to the customer in the app." });
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Support", href: "/support" }, { label: t.id }]}
        title={t.subject}
        badge={<StatusBadge status={t.status} />}
        description={`${t.id} · ${customerName(t.customerId)} · ${t.category}`}
        actions={!closed ? <Button onClick={() => { setStatus("RESOLVED"); setNotice({ tone: "ok", text: `${t.id} marked as resolved.` }); }}>Mark resolved</Button> : <Button onClick={() => { setStatus("OPEN"); setNotice({ tone: "brand", text: `${t.id} reopened.` }); }}>Reopen</Button>}
      />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <DetailLayout
        main={
          <Card title="Conversation">
            <ul className="space-y-5">
              {t.messages.map((m, i) => (
                <li key={i} className={`flex gap-3 ${m.from === "agent" ? "flex-row-reverse" : ""}`}>
                  <Avatar name={m.name} />
                  <div className={`max-w-[75%] min-w-0 rounded-xl px-4 py-3 ${m.from === "agent" ? "bg-brand-100" : "bg-sunken ring-1 ring-inset ring-line"}`}>
                    <p className="wrap-any whitespace-pre-wrap text-sm text-ink">{m.text}</p>
                    <p className="mt-1.5 text-xs text-muted">{m.name} · {fmtDateTime(m.at)}</p>
                  </div>
                </li>
              ))}
            </ul>

            {!closed && (
              <form onSubmit={send} className="mt-6 border-t border-line pt-5">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink">Reply</span>
                  <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4} aria-invalid={touched && invalid} className="w-full resize-none rounded-lg bg-surface px-3 py-2.5 text-sm text-ink ring-1 ring-inset ring-line-strong focus:ring-2 focus:ring-brand-500 aria-[invalid=true]:ring-bad" />
                </label>
                {touched && invalid && <p className="mt-1.5 text-xs text-bad">Write a reply before sending.</p>}
                <div className="mt-3 flex justify-end"><Button type="submit" variant="primary">Send reply</Button></div>
              </form>
            )}
          </Card>
        }
        side={
          <Card title="Details">
            <DefList
              cols={1}
              items={[
                { label: "Customer", value: <Link href={`/customers/${t.customerId}`} className="text-brand-700 hover:underline">{customerName(t.customerId)}</Link> },
                { label: "Priority", value: <StatusBadge status={t.priority} /> },
                { label: "Assignee", value: t.assignee },
                { label: "Created", value: fmtDateTime(t.created) },
                { label: "Reply due", value: fmtDateTime(t.slaDue) },
              ]}
            />
          </Card>
        }
      />
    </>
  );
}
