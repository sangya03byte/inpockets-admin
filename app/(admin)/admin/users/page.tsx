"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { adminUsers, roles } from "../adminData";

export default function AdminUsersPage() {
  const [users, setUsers] = useState(adminUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createRole, setCreateRole] = useState(roles[0]?.id ?? "");
  const [formError, setFormError] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.id.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const selectedUser = users.find((user) => user.id === selectedUserId);

  function openRoleModal(userId: string) {
    const user = users.find((item) => item.id === userId);
    if (!user) return;
    setSelectedUserId(userId);
    setSelectedRole(user.role);
    setChangeReason("");
    setFormError("");
  }

  function closeRoleModal() {
    setSelectedUserId(null);
    setSelectedRole("");
    setChangeReason("");
    setFormError("");
  }

  function confirmRoleChange() {
    if (!selectedUser || !selectedRole || !changeReason.trim()) {
      setFormError("Select a role and provide a reason to continue.");
      return;
    }
    setUsers((current) =>
      current.map((user) =>
        user.id === selectedUser.id ? { ...user, role: selectedRole } : user,
      ),
    );
    closeRoleModal();
  }

  function closeCreateModal() {
    setShowCreateModal(false);
    setCreateName("");
    setCreateEmail("");
    setCreateRole(roles[0]?.id ?? "");
    setFormError("");
  }

  function createAdminUser() {
    const name = createName.trim();
    const email = createEmail.trim();

    if (!name || !email || !createRole) {
      setFormError("Complete all fields before creating the admin user.");
      return;
    }
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      setFormError("An admin user with this email already exists.");
      return;
    }

    setUsers((current) => [
      ...current,
      {
        id: `ADM-${Date.now()}`,
        name,
        email,
        role: createRole,
        status: "Active",
      },
    ]);
    closeCreateModal();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-950">
          ΓåÉ Back to Admin &amp; RBAC
        </Link>

        <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Admin &amp; Audit</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Admin Users</h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Manage administrator accounts and their assigned roles.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setFormError(""); setShowCreateModal(true); }}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create Admin User
          </button>
        </header>

        <section aria-label="Filter admin users" className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
            <div>
              <label htmlFor="user-search" className="mb-2 block text-sm font-medium text-slate-700">Search admin users</label>
              <input
                id="user-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by ID, name or email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div>
              <label htmlFor="role-filter" className="mb-2 block text-sm font-medium text-slate-700">Filter by role</label>
              <select
                id="role-filter"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="ALL">All Roles</option>
                {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold text-slate-900">Administrator accounts</h2>
            <p className="text-sm text-slate-500">{filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-slate-700">Admin</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-slate-700">Role</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-slate-700">Status</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => {
                  const role = roles.find((item) => item.id === user.role);
                  const isActive = user.status === "Active";
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="mt-1 text-slate-500">{user.email}</p>
                        <p className="mt-1 text-xs text-slate-400">{user.id}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">{role?.name ?? user.role}</span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className={isActive ? "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700" : "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"}>{user.status}</span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <button type="button" onClick={() => openRoleModal(user.id)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                          Change Role
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-slate-900">No admin users found</p>
              <p className="mt-1 text-sm text-slate-500">Try a different name, email, ID or role filter.</p>
              {(search || roleFilter !== "ALL") && (
                <button type="button" onClick={() => { setSearch(""); setRoleFilter("ALL"); }} className="mt-4 text-sm font-medium text-slate-700 underline underline-offset-4 hover:text-slate-950">Clear filters</button>
              )}
            </div>
          )}
        </section>

        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeRoleModal(); }}>
            <section role="dialog" aria-modal="true" aria-labelledby="change-role-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <p className="text-sm font-medium text-slate-500">Admin &amp; RBAC</p>
              <h2 id="change-role-title" className="mt-1 text-xl font-semibold text-slate-950">Change Admin Role</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Choose a role for <span className="font-medium text-slate-900">{selectedUser.name}</span>. Provide a reason for the audit trail.</p>
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="new-role" className="mb-2 block text-sm font-medium text-slate-700">New role</label>
                  <select id="new-role" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200">
                    {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="change-reason" className="mb-2 block text-sm font-medium text-slate-700">Reason <span className="text-rose-600">*</span></label>
                  <textarea id="change-reason" value={changeReason} onChange={(event) => { setChangeReason(event.target.value); setFormError(""); }} rows={3} placeholder="Explain why this role change is needed" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
                </div>
              </div>
              {formError && <p role="alert" className="mt-3 text-sm text-rose-600">{formError}</p>}
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={closeRoleModal} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="button" disabled={!selectedRole || !changeReason.trim()} onClick={confirmRoleChange} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">Confirm Role Change</button>
              </div>
            </section>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCreateModal(); }}>
            <section role="dialog" aria-modal="true" aria-labelledby="create-admin-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <p className="text-sm font-medium text-slate-500">Admin &amp; RBAC</p>
              <h2 id="create-admin-title" className="mt-1 text-xl font-semibold text-slate-950">Create Admin User</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Add an administrator and assign an initial role.</p>
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="create-name" className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                  <input id="create-name" value={createName} onChange={(event) => { setCreateName(event.target.value); setFormError(""); }} autoComplete="name" placeholder="Enter full name" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
                </div>
                <div>
                  <label htmlFor="create-email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                  <input id="create-email" type="email" value={createEmail} onChange={(event) => { setCreateEmail(event.target.value); setFormError(""); }} autoComplete="email" placeholder="name@company.com" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
                </div>
                <div>
                  <label htmlFor="create-role" className="mb-2 block text-sm font-medium text-slate-700">Initial role</label>
                  <select id="create-role" value={createRole} onChange={(event) => { setCreateRole(event.target.value); setFormError(""); }} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200">
                    {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                  </select>
                </div>
              </div>
              {formError && <p role="alert" className="mt-3 text-sm text-rose-600">{formError}</p>}
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={closeCreateModal} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="button" onClick={createAdminUser} disabled={!createName.trim() || !createEmail.trim() || !createRole} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">Create User</button>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
