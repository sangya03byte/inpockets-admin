"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { adminUsers, roles } from "../adminData";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [changeReason, setChangeReason] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return adminUsers.filter((user) => {
      const matchesSearch =
        !query ||
        user.id.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  const selectedUser = adminUsers.find(
    (user) => user.id === selectedUserId,
  );

  const handleRoleChange = () => {
    if (!changeReason.trim()) {
      return;
    }

    setSelectedUserId(null);
    setChangeReason("");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to Admin & RBAC
        </Link>

        <div className="mb-8 mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Admin & Audit
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Admin Users
            </h1>

            <p className="mt-2 text-slate-600">
              Manage admin accounts and their assigned roles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="w-fit rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create Admin User
          </button>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, or admin ID..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            >
              <option value="ALL">All Roles</option>

              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {filteredUsers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <h2 className="text-lg font-semibold">
                No admin users found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing the search or role filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold">
                      Admin
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Email
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Assigned Role
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const role = roles.find(
                      (item) => item.id === user.role,
                    );

                    return (
                      <tr
                        key={user.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium">{user.name}</p>

                          <p className="mt-1 text-xs text-slate-500">
                            {user.id}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {user.email}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {role?.name ?? user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {user.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedUserId(user.id)}
                            className="text-sm font-medium text-slate-700 hover:text-slate-950"
                          >
                            Change Role
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">
              Change Admin Role
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Change the assigned role for{" "}
              <span className="font-medium text-slate-900">
                {selectedUser.name}
              </span>
              .
            </p>

            <label
              htmlFor="newRole"
              className="mt-5 block text-sm font-medium text-slate-700"
            >
              New Role
            </label>

            <select
              id="newRole"
              defaultValue={selectedUser.role}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            <label
              htmlFor="changeReason"
              className="mt-5 block text-sm font-medium text-slate-700"
            >
              Change Reason
            </label>

            <textarea
              id="changeReason"
              value={changeReason}
              onChange={(event) => setChangeReason(event.target.value)}
              placeholder="Explain why this role change is needed..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedUserId(null);
                  setChangeReason("");
                }}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!changeReason.trim()}
                onClick={handleRoleChange}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirm Role Change
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">
              Create Admin User
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Create a new admin account. Backend account creation will be
              connected when the Admin Users API is available.
            </p>

            <div className="mt-5 grid gap-4">
              <input
                type="text"
                placeholder="Full name"
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
              />

              <input
                type="email"
                placeholder="Email address"
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
              />

              <select className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900">
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}