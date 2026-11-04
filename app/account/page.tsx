"use client";

import { useState } from "react";
import { Badge, Button, Card, DefList, Field, Notice, PageHeader, inputClass } from "@/components/ui";
import { ErrorNote, Loading, useAction } from "@/components/live";
import { api } from "@/lib/api";
import { humanize } from "@/lib/format";
import type { Me } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export default function Account() {
  const me = useApi<Me>("admin/auth/me");
  const act = useAction(me.reload);
  const [setup, setSetup] = useState<{ secret: string; otpauth_uri: string } | null>(null);
  const [code, setCode] = useState("");

  if (me.loading && !me.data) return <Loading what="account" />;
  if (!me.data) return <ErrorNote error={me.error} />;
  const m = me.data;

  return (
    <>
      <PageHeader title="My account" description="Your role and sign-in security." />
      {m.mfa_enrollment_required && <div className="mb-4"><Notice tone="warn"><strong>Set up MFA to continue.</strong> Your organisation requires a second factor before you can use the console.</Notice></div>}
      <div className="mb-4"><ErrorNote error={act.error} /></div>
      <div className="space-y-6">
        <Card title="Role and permissions">
          <DefList cols={1} items={[
            { label: "Role", value: humanize(m.role) },
            { label: "Permissions", value: <span className="flex flex-wrap gap-1.5">{m.permissions.map((p) => <Badge key={p} tone="neutral" dot={false}>{humanize(p)}</Badge>)}</span> },
          ]} />
        </Card>
        <Card title="Two-factor authentication (MFA)" description="A time-based code from an authenticator app, asked for in addition to your SMS code.">
          {m.mfa_enabled ? <Badge tone="ok">MFA is on</Badge> : setup ? (
            <div className="space-y-4">
              <Notice tone="brand">In your authenticator app choose &ldquo;enter a setup key&rdquo; and type this key (or open the link on a phone that has an authenticator).</Notice>
              <DefList cols={1} items={[
                { label: "Setup key", value: <code className="num select-all break-all rounded bg-canvas px-2 py-1">{setup.secret}</code> },
                { label: "Link", value: <a className="break-all text-brand-700 underline" href={setup.otpauth_uri}>Open in authenticator</a> },
              ]} />
              <Field label="Code from the app" hint="Enter the current 6-digit code to finish."><input className={inputClass} inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} /></Field>
              <Button variant="primary" disabled={act.busy || code.length !== 6} onClick={async () => { if (await act.run(() => api.post("admin/auth/mfa/confirm", { code }))) { setSetup(null); setCode(""); } }}>Turn on MFA</Button>
            </div>
          ) : (
            <Button variant="primary" disabled={act.busy} onClick={() => act.run(async () => setSetup(await api.post("admin/auth/mfa/enroll")))}>Set up MFA</Button>
          )}
        </Card>
      </div>
    </>
  );
}
