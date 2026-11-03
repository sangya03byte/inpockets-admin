"use client";

import { useState } from "react";
import { Badge, Button, Card, DataTable, Dialog, Field, Notice, PageHeader, StatusBadge, inputClass, type Column } from "@/components/ui";
import { ErrorNote, Loading, useAction } from "@/components/live";
import { api } from "@/lib/api";
import { fmtDate, humanize } from "@/lib/format";
import { useSession } from "@/lib/session";
import type { Staff } from "@/lib/types";
import { useApi } from "@/lib/use-api";

const ROLES = ["SUPER_ADMIN", "SENIOR_UNDERWRITER", "UNDERWRITER", "FINANCE"];

export default function StaffPage() {
  const { me, can } = useSession();
  const list = useApi<Staff[]>(can("ADMIN_MANAGE") ? "admin/staff" : null);
  const act = useAction(list.reload);
  const [creating, setCreating] = useState(false);

  if (!can("ADMIN_MANAGE")) return <Notice tone="warn">Only a super admin can manage staff.</Notice>;

  const columns: Column<Staff>[] = [
    { key: "p", header: "Mobile", render: (s) => <span className="num text-ink">…{s.phone_last4}</span> },
    { key: "r", header: "Role", render: (s) => (
      <select className={`${inputClass} h-8 w-52`} value={s.role} disabled={act.busy || s.user_id === me?.user_id}
        onChange={(e) => act.run(() => api.patch(`admin/staff/${s.id}`, { role: e.target.value }))} aria-label={`Role for staff …${s.phone_last4}`}>
        {ROLES.map((r) => <option key={r} value={r}>{humanize(r)}</option>)}
      </select>) },
    { key: "a", header: "Access", render: (s) => <StatusBadge status={s.is_active ? "ACTIVE" : "DISABLED"} /> },
    { key: "m", header: "MFA", render: (s) => <Badge tone={s.mfa_enabled ? "ok" : "warn"}>{s.mfa_enabled ? "On" : "Off"}</Badge> },
    { key: "c", header: "Added", render: (s) => <span className="text-sm text-muted">{fmtDate(s.created_at)}</span> },
    { key: "x", header: "", align: "right", render: (s) => s.user_id === me?.user_id ? <span className="text-xs text-faint">You</span> : (
      <span className="flex justify-end gap-2">
        <Button disabled={act.busy} onClick={() => act.run(() => api.patch(`admin/staff/${s.id}`, { is_active: !s.is_active }))}>{s.is_active ? "Disable" : "Enable"}</Button>
        {s.mfa_enabled && <Button disabled={act.busy} onClick={() => { if (confirm("Reset this person's MFA? They must enrol again and are signed out.")) void act.run(() => api.post(`admin/staff/${s.id}/reset-mfa`)); }}>Reset MFA</Button>}
      </span>) },
  ];

  return (
    <>
      <PageHeader title="Staff" description="Who can sign in to this console. Every change is audited, and changing someone's role or access signs them out."
        actions={<Button variant="primary" onClick={() => setCreating(true)}>Add staff member</Button>} />
      <div className="mb-4"><ErrorNote error={act.error ?? list.error} /></div>
      <Card flush>{list.loading && !list.data ? <Loading what="staff" /> : <DataTable columns={columns} rows={list.data ?? []} rowKey={(s) => s.id} />}</Card>
      {creating && <AddDialog onClose={() => setCreating(false)} onCreate={async (phone, role) => { if (await act.run(() => api.post("admin/staff", { phone_number: phone, role }))) setCreating(false); }} busy={act.busy} />}
    </>
  );
}

function AddDialog({ onClose, onCreate, busy }: { onClose: () => void; onCreate: (phone: string, role: string) => void; busy: boolean }) {
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("UNDERWRITER");
  return (
    <Dialog open onClose={onClose} title="Add a staff member" description="They sign in with this mobile number. A role grants only the permissions it needs; approving loans and paying them out are never in the same role.">
      <div className="space-y-4">
        <Field label="Mobile number"><input className={inputClass} inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} /></Field>
        <Field label="Role"><select className={inputClass} value={role} onChange={(e) => setRole(e.target.value)}>{ROLES.map((r) => <option key={r} value={r}>{humanize(r)}</option>)}</select></Field>
        <div className="flex justify-end gap-2"><Button onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy || phone.length !== 10} onClick={() => onCreate(phone, role)}>Add</Button></div>
      </div>
    </Dialog>
  );
}
