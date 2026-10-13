"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Badge, Button, Card, Dialog, Field, inputClass, Notice, PageHeader, ReasonDialog } from "@/components/ui";
import { PERMISSIONS, roles as seedRoles, type Role } from "@/lib/mock";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(seedRoles);
  const [selectedId, setSelectedId] = useState(seedRoles[0].id);
  const [draft, setDraft] = useState<string[] | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [create, setCreate] = useState(false);
  const [notice, setNotice] = useState("");

  const selected = roles.find((r) => r.id === selectedId) ?? roles[0];
  const locked = selected.id === "SUPER_ADMIN";
  const perms = draft ?? selected.permissions;
  const dirty = draft !== null && draft.slice().sort().join() !== selected.permissions.slice().sort().join();

  const groups = useMemo(() => {
    const m = new Map<string, typeof PERMISSIONS>();
    PERMISSIONS.forEach((p) => m.set(p.group, [...(m.get(p.group) ?? []), p]));
    return Array.from(m.entries());
  }, []);

  const toggle = (id: string) => setDraft(perms.includes(id) ? perms.filter((p) => p !== id) : [...perms, id]);

  return (
    <>
      <PageHeader title="Roles and permissions" description="Permissions are granular. A support role never gets approval or policy rights by default." actions={<Button variant="primary" onClick={() => setCreate(true)}>Create role</Button>} />
      {notice && <Notice tone="ok">{notice}</Notice>}

      <div className="grid grid-cols-[300px_minmax(0,1fr)] items-start gap-6">
        <Card title="Roles" flush>
          <ul className="max-h-[640px] divide-y divide-line overflow-y-auto">
            {roles.map((r) => (
              <li key={r.id}>
                <button type="button" onClick={() => { setSelectedId(r.id); setDraft(null); }} aria-current={r.id === selected.id} className={`block w-full px-5 py-3 text-left transition-colors ${r.id === selected.id ? "bg-brand-100" : "hover:bg-brand-50"}`}>
                  <span className="block truncate text-sm font-medium text-ink">{r.name}</span>
                  <span className="text-xs text-muted">{r.permissions.length} permissions</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title={selected.name}
          description={selected.description}
          action={locked ? <Badge tone="neutral" dot={false}>Locked</Badge> : <div className="flex gap-2">{dirty && <Button onClick={() => setDraft(null)}>Discard</Button>}<Button variant="primary" disabled={!dirty} onClick={() => setConfirm(true)}>Save changes</Button></div>}
        >
          <div className="space-y-6">
            {groups.map(([group, items]) => (
              <fieldset key={group}>
                <legend className="mb-2 text-xs font-medium text-muted">{group}</legend>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {items.map((p) => (
                    <label key={p.id} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${locked ? "" : "cursor-pointer hover:bg-brand-50"}`}>
                      <input type="checkbox" checked={perms.includes(p.id)} disabled={locked} onChange={() => toggle(p.id)} className="size-4 shrink-0 accent-[var(--color-brand-600)]" />
                      <span className="min-w-0 text-body">{p.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </Card>
      </div>

      <ReasonDialog
        open={confirm}
        title="Save permission changes"
        description={`${selected.name}: ${perms.length} permissions`}
        confirmLabel="Save changes"
        reasonLabel="Why is this changing?"
        onClose={() => setConfirm(false)}
        onConfirm={() => { setRoles(roles.map((r) => (r.id === selected.id ? { ...r, permissions: perms } : r))); setDraft(null); setConfirm(false); setNotice(`Permissions updated for ${selected.name}. Logged in the audit trail.`); }}
      />
      {create && (
        <CreateRole
          onClose={() => setCreate(false)}
          onCreate={(r) => { setRoles([...roles, r]); setSelectedId(r.id); setDraft(null); setCreate(false); setNotice(`Role ${r.name} created.`); }}
        />
      )}
    </>
  );
}

function CreateRole({ onClose, onCreate }: { onClose: () => void; onCreate: (r: Role) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [perms, setPerms] = useState<string[]>(["view_customer"]);
  const [touched, setTouched] = useState(false);
  const bad = name.trim().length < 3;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (bad) return;
    onCreate({ id: name.trim().toUpperCase().replace(/\s+/g, "_"), name: name.trim(), description: description.trim() || "Custom role.", permissions: perms });
  };
  return (
    <Dialog open onClose={onClose} title="Create role" width={560}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Role name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} /></Field>
        {touched && bad && <p className="-mt-2 text-xs text-bad">Enter a name of at least 3 characters.</p>}
        <Field label="Description"><input value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} /></Field>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Permissions</legend>
          <div className="grid max-h-56 grid-cols-1 gap-1 overflow-y-auto rounded-lg p-1 ring-1 ring-inset ring-line">
            {PERMISSIONS.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-1.5 text-sm hover:bg-brand-50">
                <input type="checkbox" checked={perms.includes(p.id)} onChange={() => setPerms(perms.includes(p.id) ? perms.filter((x) => x !== p.id) : [...perms, p.id])} className="size-4 accent-[var(--color-brand-600)]" />
                {p.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex justify-end gap-2"><Button onClick={onClose}>Cancel</Button><Button type="submit" variant="primary">Create role</Button></div>
      </form>
    </Dialog>
  );
}
