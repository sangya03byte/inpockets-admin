"use client";

import { useState } from "react";
import { adminUsers, permissions, roles } from "./adminData";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"roles" | "users">("roles");
  const [selectedRole, setSelectedRole] = useState(roles[0].id);

  const role = roles.find((item) => item.id === selectedRole);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Admin & Audit
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Roles & Permissions
          </h1>

          <p className="mt-2 text-slate-600">
            Manage administrator roles, permissions, and assigned users.
          </p>
        </div>

        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("roles")}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === "roles"
                ? "border-slate-900 text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Roles & Permissions
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === "users"
                ? "border-slate-900 text-slate-950"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Admin Users
          </button>
        </div>

        {activeTab === "roles" ? (
          <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-slate-950">
                  Roles
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Select a role to view its permissions.
                </p>
              </div>

              <div className="space-y-2">
                {roles.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRole(item.id)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                      selectedRole === item.id
                        ? "border-slate-300 bg-slate-50"
                        : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.id}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              {role && (
                <>
                  <div className="border-b border-slate-200 pb-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-slate-950">
                          {role.name}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {role.description}
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {role.id}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-slate-950">
                        Permission Grid
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Permissions currently assigned to this role.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {permissions.map((permission) => {
                        const enabled = role.permissions.includes(permission);

                        return (
                          <div
                            key={permission}
                            className={`rounded-lg border p-4 ${
                              enabled
                                ? "border-slate-300 bg-slate-50"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                  enabled
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                {enabled ? "✓" : "—"}
                              </span>

                              <div>
                                <p className="break-all text-sm font-medium text-slate-900">
                                  {permission}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {enabled ? "Granted" : "Not granted"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit Permissions
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        ) : (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Admin Users
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Administrators and their assigned roles.
                </p>
              </div>

              <button
                type="button"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Add Admin User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Admin
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {adminUsers.map((user) => {
                    const userRole = roles.find(
                      (item) => item.id === user.role,
                    );

                    return (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900">
                            {user.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {user.email}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {user.id}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900">
                            {userRole?.name ?? user.role}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {user.role}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              user.status === "Active"
                                ? "bg-slate-100 text-slate-700"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            className="text-sm font-medium text-slate-700 hover:text-slate-950"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}