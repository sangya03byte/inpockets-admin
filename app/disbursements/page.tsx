"use client";

import { useState } from "react";
import { Card, DataTable, PageHeader, Segmented, StatusBadge, Toolbar, type Column } from "@/components/ui";
import { ErrorNote, Loading, money } from "@/components/live";
import { fmtDateTime } from "@/lib/format";
import type { Disbursement } from "@/lib/types";
import { useApi } from "@/lib/use-api";

type Filter = "all" | "REQUIRES_REVIEW" | "PROCESSING" | "SUCCESS" | "FAILED";

export default function Disbursements() {
  const [filter, setFilter] = useState<Filter>("all");
  const { data, error, loading } = useApi<Disbursement[]>(`admin/disbursements?limit=200${filter === "all" ? "" : `&status=${filter}`}`);

  const columns: Column<Disbursement>[] = [
    { key: "id", header: "Payout", render: (d) => <span className="num font-medium text-ink">{d.id.slice(0, 8)}</span> },
    { key: "amt", header: "Amount", align: "right", render: (d) => <span className="num font-medium text-ink">{money(d.amount)}</span> },
    { key: "acct", header: "Account", render: (d) => <div><p className="num text-sm text-body">{d.account_number_masked}</p><p className="text-xs text-muted">{d.ifsc}</p></div> },
    { key: "st", header: "Status", render: (d) => <StatusBadge status={d.status} /> },
    { key: "at", header: "Attempt", render: (d) => <span className="num">{d.attempt}</span> },
    { key: "utr", header: "UTR", render: (d) => <span className="num text-sm text-muted">{d.utr ?? "—"}</span> },
    { key: "req", header: "Requested", render: (d) => <span className="whitespace-nowrap text-sm text-muted">{fmtDateTime(d.requested_at)}</span> },
  ];

  return (
    <>
      <PageHeader title="Disbursements" description="Payouts to customers. A payout is only ever marked paid from the provider's confirmation, never from the app." />
      <ErrorNote error={error} />
      <Card flush>
        <Toolbar>
          <Segmented<Filter> value={filter} onChange={setFilter} options={[
            { value: "all", label: "All" }, { value: "REQUIRES_REVIEW", label: "Needs review" }, { value: "PROCESSING", label: "Processing" },
            { value: "SUCCESS", label: "Paid" }, { value: "FAILED", label: "Failed" },
          ]} />
        </Toolbar>
        {loading && !data ? <Loading what="payouts" /> : <DataTable columns={columns} rows={data ?? []} rowKey={(d) => d.id} rowHref={(d) => `/disbursements/${d.id}`} />}
        <div className="border-t border-line px-5 py-3 text-xs text-muted">{data ? `${data.length} payout${data.length === 1 ? "" : "s"}` : ""}</div>
      </Card>
    </>
  );
}
