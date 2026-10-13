# InPockets: how the mobile app, backend and admin panel talk

> **Read this first.** This is derived from `handbook.txt`, the READMEs of the two GitHub repos
> (Expo app, FastAPI backend) and the admin zip. GitHub blocked automated access to the file
> trees, so **no backend router code was read**. Endpoint paths in `lib/api.ts` are proposals
> and must be checked against the real routers. The backend `main` branch is also incomplete
> (files still local), so some of this may already exist in your unpushed work.

## 1. The three pieces

| Piece | Stack | Who uses it | Talks to |
|---|---|---|---|
| Mobile app | Expo / React Native, blue palette (#3B82F6, #60A5FA) | Customers | Backend `/api/v1/...` only |
| Backend | FastAPI (+ database, queue, ledger, provider adapters) | Both clients | Providers (KYC, bureau, payouts), DB |
| Admin panel | Next.js 16, Tailwind 4 (this project) | Staff | Backend `/api/v1/admin/...` only |

Rule that makes everything else safe: **neither client ever talks to a provider or to the
database.** Both only call the backend. The backend is the only place that decides, moves money
or writes the ledger.

## 2. One application, end to end

```
CUSTOMER (app)                BACKEND                          STAFF (admin)
──────────────                ───────                          ─────────────
Sign up, OTP ───────────────► create customer
PAN + DigiLocker + liveness ► call providers, store results ─► KYC review (only if flagged)
Request amount + tenure ────► create application
                              run risk + policy → decision
                              ├─ AUTO_APPROVE ─────────────┐
                              ├─ AUTO_REJECT               │
                              ├─ PENDING_PROVIDER (retry)  │
                              └─ MANUAL_REVIEW ───────────────► Applications queue
                                                                 approve / reject / ask info / escalate
                              ◄──────────── decision + reason ───┘
Sees offer + KFS ◄─────────── generate offer
Accepts, e-signs ───────────► store signed agreement
Adds bank account ──────────► verify account, name match
                              all checks pass → READY ─────────► Disbursements: finance RELEASES payout
                              send to provider (idempotent)
                              provider webhook (verified) ───► payout SUCCESS
                              ledger entry + repayment schedule
Sees money + schedule ◄─────── notify
Repays (UPI/NACH) ──────────► provider webhook (verified) ──► payment SUCCESS, ledger credit
                              missed due date ───────────────► Collections case, Reconciliation
```

Approved is not disbursed. Disbursement has its own manual release, its own checks and its own state.

## 3. What the admin panel reads and writes

| Admin screen | Reads | Writes (all require a `reason`, all audited) |
|---|---|---|
| Dashboard | counts across queues | none |
| Applications | application, risk dimensions, signals, policy + model version | approve (amount ≤ eligible), reject, request info, escalate |
| KYC review | PAN / DigiLocker / liveness results, face-match score | verify, retry, fail |
| Fraud review | signals, device links | clear, escalate, confirm and block |
| Disbursements | pre-disbursement checks, provider ref | **release**, retry (same idempotency key) |
| Loans / Payments | ledger-derived balances, schedule | none (read only) |
| Reconciliation | ledger vs provider vs bank | post adjustment entry, mark explained |
| Collections | overdue cases, contact log | log contact, promise to pay, escalate |
| Support / Complaints | tickets, history | reply, resolve, escalate |
| Policy / Loan levels | versions, levels | create draft, approve (second person) |
| Admin users / Roles | users, roles, permissions | invite, deactivate, change permissions |
| Audit log | append-only events | none |

## 4. Rules the UI already enforces (and the backend must enforce again)

1. The browser is never trusted. Every permission, amount cap and state transition is re-checked server-side.
2. Approve cannot exceed the policy-eligible amount. Going above needs the escalation path.
3. Release is idempotent. The backend owns the idempotency key; a retry reuses it.
4. Success shown to a customer comes from a **verified provider webhook**, not from the app.
5. Ledger rows are never edited. Corrections are new reversal/adjustment rows.
6. Policy changes create a new version. A decision stores the version it used. The author cannot approve their own draft.
7. PAN and phone are masked in lists. Unmasked identity data needs `view_sensitive_identity` and writes an audit event.
8. Raw Aadhaar data is never stored or displayed.

## 5. Suggested contract (to verify against your routers)

Auth: `POST /admin/auth/login` → `POST /admin/auth/mfa` → httpOnly cookie session. No tokens in localStorage.
Lists: `GET /admin/{applications,kyc,fraud-cases,disbursements,reconciliation,policies,audit-events}` with `?status=&q=&cursor=`.
Actions: `POST /admin/applications/{id}/{approve|reject|request-info|escalate}` body `{ reason, amount? }`;
`POST /admin/disbursements/{id}/{release|retry}`; and the equivalents in `lib/api.ts`.
Every response includes `x-request-id`; the admin shows it in the audit drawer.

## 6. Connecting this project

1. Set `NEXT_PUBLIC_API_BASE_URL`.
2. Fix paths in `lib/api.ts` to match the real routers.
3. In each page, replace the `lib/mock` import with a fetch (server component or SWR) and call the `adminApi.*` action inside each `onConfirm`.
4. Add a route guard (middleware) that checks the session and the role's permissions; hide nav items the role cannot use.
5. Remove the "Sandbox data" pill in `components/Topbar.tsx`.

## 7. Open questions for you

- Do endpoint names and response shapes match section 5? Send the router files and I will align types.
- What are the real loan levels, amounts, tenures and charges? The values in `lib/mock.ts` are handbook examples, not approved policy.
- Is the lender (NBFC or partner) the one who must approve policy and payouts? That decides who gets `release_disbursement` and `change_policy`.
