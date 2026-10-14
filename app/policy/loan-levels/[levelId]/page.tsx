"use client";

import { useParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button, Card, DetailLayout, Field, inputClass, NotFoundState, Notice, PageHeader, StatusBadge } from "@/components/ui";
import { getLevel } from "@/lib/mock";

export default function LoanLevelPage() {
  const { levelId } = useParams<{ levelId: string }>();
  const level = getLevel(levelId);
  const [min, setMin] = useState(String(level?.min ?? ""));
  const [max, setMax] = useState(String(level?.max ?? ""));
  const [tenure, setTenure] = useState(String(level?.maxTenureMonths ?? ""));
  const [decision, setDecision] = useState<string>(level?.decision ?? "AUTO");
  const [saved, setSaved] = useState(false);
  const [touched, setTouched] = useState(false);

  if (!level) return <NotFoundState what="Loan level" backHref="/policy/loan-levels" backLabel="Back to loan levels" />;

  const errors: string[] = [];
  const nMin = Number(min), nMax = Number(max), nTen = Number(tenure);
  if (!(nMin > 0)) errors.push("Minimum amount must be greater than zero.");
  if (!(nMax > nMin)) errors.push("Maximum amount must be greater than the minimum.");
  if (!(Number.isInteger(nTen) && nTen >= 1)) errors.push("Tenure must be a whole number of months, at least 1.");

  function submit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    setSaved(false);
    if (errors.length === 0) setSaved(true);
  }

  const num = (set: (v: string) => void) => (e: { target: { value: string } }) => { set(e.target.value.replace(/[^\d]/g, "")); setSaved(false); };

  return (
    <>
      <PageHeader crumbs={[{ label: "Lending policy", href: "/policy" }, { label: "Loan levels", href: "/policy/loan-levels" }, { label: level.id }]} title={`Level ${level.id}`} badge={<StatusBadge status={level.decision} />} description={level.progression} />
      {saved && <Notice tone="ok">Saved to draft policy version 3.3. It goes live only after a second person approves it.</Notice>}
      {touched && errors.length > 0 && <Notice tone="bad">{errors.join(" ")}</Notice>}

      <DetailLayout
        main={
          <Card title="Limits and decision mode">
            <form onSubmit={submit} className="grid max-w-xl grid-cols-2 gap-5">
              <Field label="Minimum amount (₹)"><input inputMode="numeric" value={min} onChange={num(setMin)} className={`${inputClass} num`} /></Field>
              <Field label="Maximum amount (₹)"><input inputMode="numeric" value={max} onChange={num(setMax)} className={`${inputClass} num`} /></Field>
              <Field label="Maximum tenure (months)"><input inputMode="numeric" value={tenure} onChange={num(setTenure)} className={`${inputClass} num`} /></Field>
              <Field label="Decision mode">
                <select value={decision} onChange={(e) => { setDecision(e.target.value); setSaved(false); }} className={inputClass}>
                  <option value="AUTO">Automatic</option>
                  <option value="MANUAL_REVIEW">Manual review</option>
                </select>
              </Field>
              <div className="col-span-2 flex justify-end"><Button type="submit" variant="primary">Save to draft policy</Button></div>
            </form>
          </Card>
        }
        side={
          <>
            <Card title="Required checks">
              <ul className="space-y-2 text-sm text-body">{level.requiredChecks.map((c) => (<li key={c} className="flex gap-2"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />{c}</li>))}</ul>
            </Card>
            <Card title="Approval authority"><p className="text-sm text-body">{level.approver}</p><p className="mt-1 text-xs text-muted">Best risk band allowed: {level.minRiskBand.toLowerCase()} or better</p></Card>
          </>
        }
      />
    </>
  );
}
