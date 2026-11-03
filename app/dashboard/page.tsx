"use client";

import { Card, DataTable, Grid, PageHeader, Person, Stat, StatusBadge, type Column } from "@/components/ui";
import { ErrorNote, Loading, money } from "@/components/live";
import { fmtDateTime } from "@/lib/format";
import type { Disbursement, Queue, QueueItem } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { useSession } from "@/lib/session";

const q = (statuses: string[], size = 1) => `admin/loan-applications/queue?${statuses.map((s) => `status=${s}`).join("&")}&page_size=${size}`;

export default function Dashboard() {
  const { me, can } = useSession();
  const submitted = useApi<Queue>(q(["SUBMITTED"]));
  const processing = useApi<Queue>(q(["PROCESSING", "MANUAL_REVIEW"]));
  const info = useApi<Queue>(q(["PENDING_ADDITIONAL_INFORMATION"]));
  const approved = useApi<Queue>(q(["APPROVED"]));
  const oldest = useApi<Queue>(q(["SUBMITTED", "PROCESSING", "MANUAL_REVIEW"], 8));
  const payouts = useApi<Disbursement[]>(can("DISBURSEMENT_READ") || can("DISBURSEMENT_EXECUTE") ? "admin/disbursements?limit=200" : null);

  const count = (d: Queue | null) => (d ? d.total : "…");
  const by = (s: string) => payouts.data?.filter((d) => d.status === s).length ?? 0;
  const reviewPayouts = by("REQUIRES_REVIEW");

  const columns: Column<QueueItem>[] = [
    { key: "n", header: "Application", render: (a) => <span className="num font-medium text-ink">{a.application_number}</span> },
    { key: "c", header: "Customer", render: (a) => <Person name={a.customer_name ?? "Unnamed customer"} sub={a.phone_last4 ? `…${a.phone_last4}` : undefined} /> },
    { key: "r", header: "Requested", align: "right", render: (a) => <span className="num">{money(a.requested_amount)}</span> },
    { key: "s", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    { key: "t", header: "Submitted", render: (a) => <span className="text-sm text-muted">{a.submitted_at ? fmtDateTime(a.submitted_at) : "—"}</span> },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description={me ? `Signed in as ${me.role.replaceAll("_", " ").toLowerCase()}. Live figures from the backend.` : undefined} />
      <ErrorNote error={submitted.error ?? processing.error} />
      <Grid cols={4}>
        <Stat label="Waiting for pickup" value={count(submitted.data)} hint="Submitted, not yet processed" href="/applications" tone={submitted.data && submitted.data.total > 0 ? "warn" : undefined} />
        <Stat label="In review" value={count(processing.data)} hint="Processing or manual review" href="/applications" />
        <Stat label="Waiting on customer" value={count(info.data)} hint="Additional information requested" />
        <Stat label="Approved" value={count(approved.data)} hint="Ready for an offer" href="/applications" />
      </Grid>
      {payouts.data && (
        <div className="mt-4">
          <Grid cols={4}>
            <Stat label="Payouts in flight" value={by("PENDING") + by("PROCESSING")} href="/disbursements" />
            <Stat label="Payouts needing review" value={reviewPayouts} tone={reviewPayouts ? "bad" : undefined} hint={reviewPayouts ? "Finance action required" : "None"} href="/disbursements" />
            <Stat label="Paid out" value={by("SUCCESS")} href="/disbursements" />
            <Stat label="Failed or reversed" value={by("FAILED") + by("REVERSED")} href="/disbursements" />
          </Grid>
        </div>
      )}
      <div className="mt-6">
        <Card title="Oldest applications waiting" description="First in, first out." flush>
          {oldest.loading ? <Loading what="applications" /> : <DataTable columns={columns} rows={oldest.data?.items ?? []} rowKey={(a) => a.id} rowHref={(a) => `/applications/${a.id}`} />}
        </Card>
      </div>
    </>
  );
}
