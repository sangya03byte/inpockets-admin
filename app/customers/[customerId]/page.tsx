"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Avatar, Card, DataTable, type Column, DefList, DetailLayout, NotFoundState, PageHeader, StatusBadge, Timeline } from "@/components/ui";
import { applications, complaints, fraudCases, getCustomer, kycRecords, loans, tickets, type Application, type Loan } from "@/lib/mock";
import { fmtDate, fmtDateTime, inr } from "@/lib/format";

export default function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const c = getCustomer(customerId);
  if (!c) return <NotFoundState what="Customer" backHref="/customers" backLabel="Back to customers" />;

  const myLoans = loans.filter((l) => l.customerId === c.id);
  const myApps = applications.filter((a) => a.customerId === c.id);
  const kyc = kycRecords.find((k) => k.customerId === c.id);
  const fraud = fraudCases.filter((f) => f.customerId === c.id && f.state !== "CLEARED");
  const myTickets = tickets.filter((t) => t.customerId === c.id);
  const myComplaints = complaints.filter((x) => x.customerId === c.id);
  const outstanding = myLoans.reduce((s, l) => s + l.outstanding, 0);
  const overdue = myLoans.find((l) => l.status === "OVERDUE");

  const loanCols: Column<Loan>[] = [
    { key: "id", header: "Loan", render: (l) => <span className="num font-medium text-ink">{l.id}</span> },
    { key: "lvl", header: "Level", render: (l) => l.level },
    { key: "p", header: "Principal", align: "right", render: (l) => <span className="num">{inr(l.principal)}</span> },
    { key: "o", header: "Outstanding", align: "right", render: (l) => <span className="num">{l.outstanding ? inr(l.outstanding) : "—"}</span> },
    { key: "s", header: "Status", render: (l) => <StatusBadge status={l.status} /> },
  ];
  const appCols: Column<Application>[] = [
    { key: "id", header: "Application", render: (a) => <span className="num font-medium text-ink">{a.id}</span> },
    { key: "r", header: "Requested", align: "right", render: (a) => <span className="num">{inr(a.requested)}</span> },
    { key: "b", header: "Risk", render: (a) => (a.risk.band ? <StatusBadge status={a.risk.band} /> : "—") },
    { key: "s", header: "Status", render: (a) => <StatusBadge status={a.state} /> },
    { key: "d", header: "Submitted", render: (a) => <span className="whitespace-nowrap text-muted">{fmtDate(a.submitted)}</span> },
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Customers", href: "/customers" }, { label: c.name }]}
        title={
          <span className="flex items-center gap-3">
            <Avatar name={c.name} size={40} />
            {c.name}
          </span>
        }
        badge={<StatusBadge status={c.status} />}
        description={`${c.id} · joined ${fmtDate(c.joined)}`}
      />

      <DetailLayout
        main={
          <>
            <Card title="Profile" description="Verified fields come from PAN and KYC providers. Contact fields are customer provided.">
              <DefList
                cols={3}
                items={[
                  { label: "Phone", value: c.phone },
                  { label: "Email", value: c.email },
                  { label: "City", value: c.city },
                  { label: "Date of birth", value: fmtDate(c.dob) },
                  { label: "PAN", value: c.pan },
                  { label: "Primary device", value: c.device },
                ]}
              />
            </Card>

            <Card title="Applications" flush>
              <DataTable columns={appCols} rows={myApps} rowKey={(a) => a.id} rowHref={(a) => `/applications/${a.id}`} empty={<p className="px-5 py-8 text-center text-sm text-muted">No applications yet.</p>} />
            </Card>

            <Card title="Loan history" flush>
              <DataTable columns={loanCols} rows={myLoans} rowKey={(l) => l.id} rowHref={(l) => `/loans/${l.id}`} empty={<p className="px-5 py-8 text-center text-sm text-muted">No loans yet.</p>} />
            </Card>

            <Card title="Support and complaints">
              {myTickets.length + myComplaints.length === 0 ? (
                <p className="text-sm text-muted">Nothing raised by this customer.</p>
              ) : (
                <Timeline
                  items={[
                    ...myTickets.map((t) => ({ title: <Link href={`/support/${t.id}`} className="hover:text-brand-700">{t.id} · {t.subject}</Link>, meta: `Ticket · ${fmtDateTime(t.created)}`, tone: "brand" as const })),
                    ...myComplaints.map((x) => ({ title: <Link href={`/complaints/${x.id}`} className="hover:text-brand-700">{x.id} · {x.subject}</Link>, meta: `Complaint · ${fmtDate(x.received)}`, tone: "warn" as const })),
                  ]}
                />
              )}
            </Card>
          </>
        }
        side={
          <>
            <Card title="Standing">
              <DefList
                cols={2}
                items={[
                  { label: "Loan level", value: c.level },
                  { label: "Outstanding", value: outstanding ? inr(outstanding) : "None" },
                  { label: "KYC", value: <StatusBadge status={c.kyc} /> },
                  { label: "Loans taken", value: myLoans.length },
                ]}
              />
              {kyc && (
                <Link href={`/kyc/${kyc.id}`} className="mt-4 block text-sm font-medium text-brand-700 hover:underline">
                  Open KYC record {kyc.id}
                </Link>
              )}
            </Card>

            {(overdue || fraud.length > 0) && (
              <Card title="Needs attention">
                <ul className="space-y-3 text-sm">
                  {overdue && (
                    <li className="wrap-any text-bad">
                      <Link href={`/loans/${overdue.id}`} className="font-medium hover:underline">{overdue.id}</Link> is {overdue.dpd} days past due ({inr(overdue.outstanding)} outstanding).
                    </li>
                  )}
                  {fraud.map((f) => (
                    <li key={f.id} className="wrap-any text-warn">
                      Open fraud case <Link href={`/fraud/${f.id}`} className="font-medium hover:underline">{f.id}</Link>.
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </>
        }
      />
    </>
  );
}
