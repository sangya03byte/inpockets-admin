"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { permissions, roles, type Role } from "../adminData";

export default function RolesPage() {
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id ?? "");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [roleList, setRoleList] = useState<Role[]>(roles);

  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

  const selectedRole = useMemo(
    () => roleList.find((role) => role.id === selectedRoleId),
    [roleList, selectedRoleId],
  );

  const togglePermission = (permission: string) => {
    if (!selectedRole) {
      return;
    }

    setRoleList((currentRoles) =>
      currentRoles.map((role) => {
        if (role.id !== selectedRole.id) {
          return role;
        }

        const hasPermission = role.permissions.includes(permission);

        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter((item) => item !== permission)
            : [...role.permissions, permission],
        };
      }),
    );
  };

  const toggleNewRolePermission = (permission: string) => {
    setNewRolePermissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission],
    );
  };

  const createRole = () => {
    const name = newRoleName.trim();

    if (!name) {
      return;
    }

    const id = name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    const newRole: Role = {
      id: id || `CUSTOM_ROLE_${roleList.length + 1}`,
      name,
      description:
        newRoleDescription.trim() || "Custom administrator role.",
      permissions: newRolePermissions,
    };

    setRoleList((current) => [...current, newRole]);
    setSelectedRoleId(newRole.id);

    setNewRoleName("");
    setNewRoleDescription("");
    setNewRolePermissions([]);
    setShowCreateModal(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-600 hover:text-slate-950"
            >
              ← Back to Administration
            </Link>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Roles & Permissions
            </h1>

            <p className="mt-2 text-slate-600">
              Manage administrator roles and their assigned permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create Role
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold">Roles</h2>

              <p className="mt-1 text-sm text-slate-500">
                {roleList.length} roles configured
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {roleList.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`w-full px-5 py-4 text-left transition ${
                    selectedRoleId === role.id
                      ? "bg-slate-100"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <p className="font-medium">{role.name}</p>

                  <p className="mt-1 text-sm text-slate-500">
                    {role.description}
                  </p>

                  <p className="mt-2 text-xs font-medium text-slate-500">
                    {role.permissions.length} permissions
                  </p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white">
            {selectedRole ? (
              <>
                <div className="border-b border-slate-200 px-6 py-5">
                  <p className="text-sm font-medium text-slate-500">
                    Role
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold">
                    {selectedRole.name}
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    {selectedRole.description}
                  </p>
                </div>

                <div className="p-6">
                  <div className="mb-5">
                    <h3 className="font-semibold">Permission Grid</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Select the permissions assigned to this role.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {permissions.map((permission) => {
                      const checked =
                        selectedRole.permissions.includes(permission);

                      return (
                        <label
                          key={permission}
                          className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePermission(permission)}
                            className="mt-1 h-4 w-4"
                          />

                          <div>
                            <p className="text-sm font-medium">
                              {permission}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {checked ? "Granted" : "Not granted"}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">
                      Current permissions
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedRole.permissions.length} of{" "}
                      {permissions.length} permissions enabled.
                    </p>
                  </div>

                  <p className="mt-5 text-xs text-slate-500">
                    Changes are currently local/mock only and will be
                    connected to the backend role-management workflow when
                    available.
                  </p>
                </div>
              </>
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="font-medium text-slate-700">
                  No role selected
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Create Role
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new administrator role with selected permissions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Role Name
                </label>

                <input
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Senior Underwriter"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Describe what this role is responsible for."
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700">
                  Permissions
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {permissions.map((permission) => (
                    <label
                      key={permission}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3"
                    >
                      <input
                        type="checkbox"
                        checked={newRolePermissions.includes(permission)}
                        onChange={() =>
                          toggleNewRolePermission(permission)
                        }
                      />

                      <span className="text-sm">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createRole}
                  disabled={!newRoleName.trim()}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Create Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}