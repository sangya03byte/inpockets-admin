"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, DataTable, type Column, DefList, DetailLayout, NotFoundState, PageHeader, Stat, StatusBadge, Grid } from "@/components/ui";
import { customerName, disbursements, getLoan, payments, type Loan, type Payment } from "@/lib/mock";
import { fmtDate, inr } from "@/lib/format";

export default function LoanDetailPage() {
  const { loanId } = useParams<{ loanId: string }>();
  const loan = getLoan(loanId);
  if (!loan) return <NotFoundState what="Loan" backHref="/loans" backLabel="Back to loans" />;

  const myPayments = payments.filter((p) => p.loanId === loan.id);
  const payout = disbursements.find((d) => d.loanId === loan.id);
  const totalRepayable = loan.installments.reduce((s, i) => s + i.amount, 0);
  const paid = loan.installments.reduce((s, i) => s + i.paid, 0);

  const schedule: Column<Loan["installments"][number]>[] = [
    { key: "no", header: "#", render: (i) => <span className="num">{i.no}</span> },
    { key: "due", header: "Due date", render: (i) => fmtDate(i.due) },
    { key: "amt", header: "Amount due", align: "right", render: (i) => <span className="num">{inr(i.amount)}</span> },
    { key: "paid", header: "Paid", align: "right", render: (i) => <span className="num">{i.paid ? inr(i.paid) : "—"}</span> },
    { key: "s", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
  ];
  const payCols: Column<Payment>[] = [
    { key: "id", header: "Payment", render: (p) => <span className="num font-medium text-ink">{p.id}</span> },
    { key: "m", header: "Method", render: (p) => p.method },
    { key: "a", header: "Amount", align: "right", render: (p) => <span className="num">{inr(p.amount)}</span> },
    { key: "d", header: "Date", render: (p) => fmtDate(p.date) },
    { key: "s", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
  ];

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Loans", href: "/loans" }, { label: loan.id }]}
        title={loan.id}
        badge={<StatusBadge status={loan.status} />}
        description={`${customerName(loan.customerId)} · level ${loan.level} · ${loan.tenureMonths} ${loan.tenureMonths === 1 ? "month" : "months"}`}
      />

      <Grid cols={4} className="mb-6">
        <Stat label="Principal" value={inr(loan.principal)} />
        <Stat label="Outstanding" value={loan.outstanding ? inr(loan.outstanding) : "Nil"} />
        <Stat label="Next due" value={loan.nextDue === "—" ? "—" : fmtDate(loan.nextDue)} />
        <Stat label="Days past due" value={loan.dpd || "0"} tone={loan.dpd > 0 ? "bad" : undefined} hint={loan.dpd > 0 ? "In collections" : "On schedule"} />
      </Grid>

      <DetailLayout
        main={
          <>
            <Card title="Repayment schedule" description="Fixed at disbursement. Never recalculated after the loan goes active." flush>
              <DataTable columns={schedule} rows={loan.installments} rowKey={(i) => String(i.no)} empty={<p className="px-5 py-8 text-center text-sm text-muted">The schedule is generated when the payout succeeds.</p>} />
            </Card>
            <Card title="Payments" flush>
              <DataTable columns={payCols} rows={myPayments} rowKey={(p) => p.id} empty={<p className="px-5 py-8 text-center text-sm text-muted">No payments recorded.</p>} />
            </Card>
          </>
        }
        side={
          <>
            <Card title="Loan">
              <DefList
                cols={1}
                items={[
                  { label: "Customer", value: <Link href={`/customers/${loan.customerId}`} className="text-brand-700 hover:underline">{customerName(loan.customerId)}</Link> },
                  { label: "Application", value: loan.applicationId ? <Link href={`/applications/${loan.applicationId}`} className="text-brand-700 hover:underline">{loan.applicationId}</Link> : "Earlier loan (before this console)" },
                  { label: "Disbursed on", value: fmtDate(loan.disbursedOn) },
                  { label: "Total repayable", value: totalRepayable ? inr(totalRepayable) : "—" },
                  { label: "Repaid so far", value: inr(paid) },
                  { label: "Payout", value: payout ? <Link href={`/disbursements/${payout.id}`} className="text-brand-700 hover:underline">{payout.id}</Link> : "—" },
                ]}
              />
            </Card>
          </>
        }
      />
    </>
  );
}
