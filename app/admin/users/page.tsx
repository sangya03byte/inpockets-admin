"use client";

import { type FormEvent, useState } from "react";
import { Badge, Button, Card, DataTable, type Column, Dialog, Field, inputClass, Notice, PageHeader, Person, StatusBadge, ReasonDialog, TableFooter } from "@/components/ui";
import { adminUsers, roles, type AdminUser } from "@/lib/mock";
import { fmtDateTime } from "@/lib/format";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [invite, setInvite] = useState(false);
  const [toggle, setToggle] = useState<AdminUser | null>(null);
  const [notice, setNotice] = useState("");

  const roleName = (id: string) => roles.find((r) => r.id === id)?.name ?? id;

  const columns: Column<AdminUser>[] = [
    { key: "n", header: "Name", minWidth: 240, render: (u) => <Person name={u.name} sub={u.email} /> },
    { key: "r", header: "Role", render: (u) => roleName(u.role) },
    { key: "mfa", header: "Two-step sign-in", render: (u) => (u.mfa ? <Badge tone="ok">On</Badge> : <Badge tone="warn">Off</Badge>) },
    { key: "s", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
    { key: "l", header: "Last active", render: (u) => <span className="whitespace-nowrap text-muted">{fmtDateTime(u.lastActive)}</span> },
    { key: "a", header: "", align: "right", render: (u) => (u.role === "SUPER_ADMIN" ? null : <Button onClick={() => setToggle(u)}>{u.status === "ACTIVE" ? "Deactivate" : "Reactivate"}</Button>) },
  ];

  return (
    <>
      <PageHeader title="Admin users" description="Staff who can sign in to this console. Access comes from the role assigned." actions={<Button variant="primary" onClick={() => setInvite(true)}>Invite user</Button>} />
      {notice && <Notice tone="ok">{notice}</Notice>}
      <Card flush>
        <DataTable columns={columns} rows={users} rowKey={(u) => u.id} />
        <TableFooter shown={users.length} total={users.length} noun="users" />
      </Card>

      {invite && (
        <InviteDialog
          onClose={() => setInvite(false)}
          onInvite={(name, email, role) => {
            setUsers([...users, { id: `ADM-${String(users.length + 1).padStart(3, "0")}`, name, email, role, status: "ACTIVE", lastActive: "—", mfa: false }]);
            setNotice(`Invitation sent to ${email}. They must set up two-step sign-in on first login.`);
            setInvite(false);
          }}
        />
      )}
      <ReasonDialog
        open={!!toggle}
        title={toggle?.status === "ACTIVE" ? "Deactivate user" : "Reactivate user"}
        description={toggle ? `${toggle.name} · ${toggle.email}` : undefined}
        confirmLabel={toggle?.status === "ACTIVE" ? "Deactivate" : "Reactivate"}
        tone={toggle?.status === "ACTIVE" ? "danger" : "primary"}
        onClose={() => setToggle(null)}
        onConfirm={() => {
          if (!toggle) return;
          setUsers(users.map((u) => (u.id === toggle.id ? { ...u, status: u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : u)));
          setNotice(`${toggle.name} is now ${toggle.status === "ACTIVE" ? "inactive" : "active"}.`);
          setToggle(null);
        }}
      />
    </>
  );
}

function InviteDialog({ onClose, onInvite }: { onClose: () => void; onInvite: (name: string, email: string, role: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("READ_ONLY");
  const [touched, setTouched] = useState(false);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (name.trim() && emailOk) onInvite(name.trim(), email.trim(), role);
  };
  return (
    <Dialog open onClose={onClose} title="Invite user">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></Field>
        {touched && !name.trim() && <p className="-mt-2 text-xs text-bad">Enter a name.</p>}
        <Field label="Work email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></Field>
        {touched && !emailOk && <p className="-mt-2 text-xs text-bad">Enter a valid email address.</p>}
        <Field label="Role" hint="Start with the least access needed.">
          <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
            {roles.filter((r) => r.id !== "SUPER_ADMIN").map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
          </select>
        </Field>
        <div className="flex justify-end gap-2"><Button onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Send invitation</Button></div>
      </form>
    </Dialog>
  );
}
