"use client";

import { useMemo, useState } from "react";
import { Card, DataTable, type Column, PageHeader, Person, SearchField, Segmented, StatusBadge, TableFooter, Toolbar } from "@/components/ui";
import { customerName, kycRecords, type KycRecord } from "@/lib/mock";
import { fmtDateTime } from "@/lib/format";

type Filter = "all" | "MANUAL_REVIEW" | "PENDING" | "VERIFIED";

export default function KycPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return kycRecords
      .filter((k) => filter === "all" || k.state === filter)
      .filter((k) => !term || k.id.toLowerCase().includes(term) || customerName(k.customerId).toLowerCase().includes(term) || k.flag.toLowerCase().includes(term));
  }, [q, filter]);

  const columns: Column<KycRecord>[] = [
    { key: "id", header: "KYC record", render: (k) => <span className="num font-medium text-ink">{k.id}</span> },
    { key: "cus", header: "Customer", minWidth: 200, render: (k) => <Person name={customerName(k.customerId)} sub={k.customerId} /> },
    { key: "pan", header: "PAN", render: (k) => <StatusBadge status={k.pan} /> },
    { key: "dl", header: "DigiLocker", render: (k) => <StatusBadge status={k.digilocker} /> },
    { key: "live", header: "Liveness", render: (k) => <StatusBadge status={k.liveness} /> },
    { key: "flag", header: "Flag", minWidth: 240, render: (k) => <span className="block truncate text-sm text-body" title={k.flag}>{k.flag}</span> },
    { key: "state", header: "Overall", render: (k) => <StatusBadge status={k.state} /> },
    { key: "at", header: "Submitted", render: (k) => <span className="whitespace-nowrap text-muted">{fmtDateTime(k.submitted)}</span> },
  ];

  const count = (f: Filter) => (f === "all" ? kycRecords.length : kycRecords.filter((k) => k.state === f).length);

  return (
    <>
      <PageHeader title="KYC review" description="PAN, DigiLocker and liveness results for each customer. Raw Aadhaar data is never stored or shown." />
      <Card flush>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search customer, record or flag" />
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All", count: count("all") },
              { value: "MANUAL_REVIEW", label: "Manual review", count: count("MANUAL_REVIEW") },
              { value: "PENDING", label: "Pending", count: count("PENDING") },
              { value: "VERIFIED", label: "Verified", count: count("VERIFIED") },
            ]}
          />
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(k) => k.id} rowHref={(k) => `/kyc/${k.id}`} />
        <TableFooter shown={rows.length} total={kycRecords.length} noun="KYC records" />
      </Card>
    </>
  );
}
