"use client";

import { useParams } from "next/navigation";
import { Card, DefList, NotFoundState, PageHeader, StatusBadge } from "@/components/ui";
import { ErrorNote, Loading } from "@/components/live";
import { fmtDate, fmtDateTime, humanize } from "@/lib/format";
import type { Customer } from "@/lib/types";
import { useApi } from "@/lib/use-api";

type Detail = Customer & { profile_id: string | null; onboarding_id: string | null; onboarding_updated_at: string | null; date_of_birth?: string | null; gender?: string | null };

export default function CustomerDetail() {
  const { customerId: id } = useParams<{ customerId: string }>();
  const { data: c, error, loading } = useApi<Detail>(`admin/customers/${id}`);
  if (loading && !c) return <Loading what="customer" />;
  if (error?.status === 404 || error?.status === 422) return <NotFoundState what="Customer" backHref="/customers" backLabel="Back to customers" />;
  if (!c) return <ErrorNote error={error} />;
  const name = [c.first_name, c.last_name].filter(Boolean).join(" ") || "Unnamed customer";
  return (
    <>
      <PageHeader crumbs={[{ label: "Customers", href: "/customers" }, { label: name }]} title={name} badge={<StatusBadge status={c.status} />} description={c.phone_number} />
      <div className="space-y-6">
        <Card title="Profile">
          <DefList items={[
            { label: "Name", value: name }, { label: "Mobile", value: c.phone_number },
            { label: "Date of birth", value: c.date_of_birth ? fmtDate(c.date_of_birth) : "—" }, { label: "Gender", value: c.gender ? humanize(c.gender) : "—" },
            { label: "Joined", value: fmtDateTime(c.created_at) }, { label: "Onboarding", value: c.onboarding_status ? `${humanize(c.onboarding_status)}${c.onboarding_step ? ` · ${humanize(c.onboarding_step)}` : ""}` : "—" },
          ]} />
        </Card>
        <Card title="Verification" description="Provider results; identity documents are never shown here.">
          <DefList items={[
            { label: "PAN", value: c.pan_status ? <><StatusBadge status={c.pan_status} /> <span className="num ml-2 text-muted">{c.pan_number_masked ?? ""}</span></> : "—" },
            { label: "KYC", value: c.kyc_status ? <StatusBadge status={c.kyc_status} /> : "—" },
            { label: "Identity / liveness", value: c.identity_verification_status ? <StatusBadge status={c.identity_verification_status} /> : "—" },
          ]} />
        </Card>
      </div>
    </>
  );
}
