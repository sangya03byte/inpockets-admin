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

  function closeRoleModal() {
    setSelectedUserId(null);
    setChangeReason("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to Admin
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Admin Users
            </h1>

            <p className="mt-2 text-slate-600">
              Manage administrator accounts and their assigned roles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create Admin User
          </button>
        </div>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-[1fr_240px]">
            <div>
              <label
                htmlFor="user-search"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Search
              </label>

              <input
                id="user-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by ID, name or email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="role-filter"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Role
              </label>

              <select
                id="role-filter"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-slate-500"
              >
                <option value="ALL">All Roles</option>

                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 font-semibold text-slate-700">
                    Admin
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-700">
                    Role
                  </th>
                  <th className="px-5 py-4 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right font-semibold text-slate-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => {
                  const role = roles.find((item) => item.id === user.role);

                  return (
                    <tr key={user.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {user.name}
                        </p>

                        <p className="mt-1 text-slate-500">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {user.id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          {role?.name ?? user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            user.status === "Active"
                              ? "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                              : "rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-500"
                          }
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedUserId(user.id)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
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

          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-slate-900">
                No admin users found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or role filter.
              </p>
            </div>
          )}
        </section>

        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold">
                Change Admin Role
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Change role for{" "}
                <span className="font-medium text-slate-900">
                  {selectedUser.name}
                </span>
                .
              </p>

              <div className="mt-5">
                <label
                  htmlFor="change-reason"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Reason
                </label>

                <textarea
                  id="change-reason"
                  value={changeReason}
                  onChange={(event) =>
                    setChangeReason(event.target.value)
                  }
                  rows={4}
                  placeholder="Enter the reason for changing this role"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeRoleModal}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!changeReason.trim()}
                  onClick={closeRoleModal}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Confirm Role Change
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold">
                Create Admin User
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Admin user creation will be connected to the backend
                workflow when available.
              </p>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}