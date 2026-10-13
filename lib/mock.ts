/**
 * Sandbox data for the admin console.
 *
 * Everything here is a stand-in for the FastAPI admin endpoints (see docs/INTEGRATION.md).
 * Loan levels, amounts and rules are EXAMPLES from the product handbook – they must come
 * from the versioned policy configuration, never from code, once the backend is connected.
 *
 * One dataset on purpose: IDs, names and amounts agree across every screen.
 */

import { NOW_ISO } from "./format";

export const NOW = NOW_ISO;

/* ───────────── Customers ───────────── */

export type Customer = {
  id: string;
  name: string;
  phone: string; // masked
  email: string;
  city: string;
  dob: string;
  pan: string; // masked
  status: "ACTIVE" | "SUSPENDED";
  kyc: "VERIFIED" | "MANUAL_REVIEW" | "PENDING" | "FAILED";
  level: string; // current loan level id, "—" for new customers
  joined: string;
  device: string;
};

export const customers: Customer[] = [
  { id: "CUS-10021", name: "Aarav Sharma", phone: "+91 98•••• 3210", email: "aarav.sharma@example.com", city: "Raipur", dob: "2006-03-14", pan: "ABCPS••••K", status: "ACTIVE", kyc: "VERIFIED", level: "L2", joined: "2026-06-11", device: "DEV-8821" },
  { id: "CUS-10022", name: "Priya Verma", phone: "+91 91•••• 6780", email: "priya.verma@example.com", city: "Bhilai", dob: "2005-11-02", pan: "BQRPV••••M", status: "ACTIVE", kyc: "VERIFIED", level: "L1", joined: "2026-07-05", device: "DEV-4472" },
  { id: "CUS-10023", name: "Rohan Patel", phone: "+91 99•••• 6655", email: "rohan.patel@example.com", city: "Durg", dob: "2005-08-21", pan: "CDEPP••••L", status: "ACTIVE", kyc: "MANUAL_REVIEW", level: "—", joined: "2026-09-27", device: "DEV-2198" },
  { id: "CUS-10024", name: "Neha Singh", phone: "+91 90•••• 5678", email: "neha.singh@example.com", city: "Korba", dob: "2006-01-30", pan: "EFGPS••••N", status: "ACTIVE", kyc: "VERIFIED", level: "L1", joined: "2026-08-02", device: "DEV-7314" },
  { id: "CUS-10025", name: "Karan Mehta", phone: "+91 97•••• 1042", email: "karan.mehta@example.com", city: "Bilaspur", dob: "2004-12-09", pan: "HIJPM••••R", status: "SUSPENDED", kyc: "VERIFIED", level: "L3", joined: "2026-03-18", device: "DEV-3306" },
  { id: "CUS-10026", name: "Vikram Rao", phone: "+91 93•••• 9921", email: "vikram.rao@example.com", city: "Raipur", dob: "2005-05-17", pan: "KLMPR••••T", status: "ACTIVE", kyc: "VERIFIED", level: "L2", joined: "2026-05-04", device: "DEV-5630" },
  { id: "CUS-10027", name: "Sana Khan", phone: "+91 88•••• 4410", email: "sana.khan@example.com", city: "Bhilai", dob: "2005-09-25", pan: "NOPPK••••S", status: "ACTIVE", kyc: "VERIFIED", level: "L2", joined: "2026-04-22", device: "DEV-6102" },
  { id: "CUS-10028", name: "Dev Joshi", phone: "+91 95•••• 7733", email: "dev.joshi@example.com", city: "Raipur", dob: "2004-10-12", pan: "QRSPJ••••D", status: "ACTIVE", kyc: "VERIFIED", level: "L1", joined: "2026-06-30", device: "DEV-9014" },
];

export const getCustomer = (id: string) => customers.find((c) => c.id === id);
export const customerName = (id: string) => getCustomer(id)?.name ?? id;

/* ───────────── Loan levels & policy (example values, configurable) ───────────── */

export type LoanLevel = {
  id: string;
  min: number;
  max: number;
  maxTenureMonths: number;
  decision: "AUTO" | "MANUAL_REVIEW";
  approver: string;
  requiredChecks: string[];
  minRiskBand: "LOW" | "MEDIUM" | "HIGH";
  progression: string;
};

export const loanLevels: LoanLevel[] = [
  { id: "L1", min: 500, max: 2000, maxTenureMonths: 1, decision: "AUTO", approver: "System", requiredChecks: ["KYC verified", "PAN verified", "Liveness passed"], minRiskBand: "MEDIUM", progression: "First loan for new customers" },
  { id: "L2", min: 2001, max: 5000, maxTenureMonths: 2, decision: "AUTO", approver: "System", requiredChecks: ["KYC verified", "1 loan repaid on time"], minRiskBand: "MEDIUM", progression: "After 1 on-time repayment at L1" },
  { id: "L3", min: 5001, max: 9000, maxTenureMonths: 3, decision: "MANUAL_REVIEW", approver: "Underwriter", requiredChecks: ["KYC verified", "Affordability check", "Credit bureau pull"], minRiskBand: "MEDIUM", progression: "After 2 on-time repayments" },
  { id: "L4", min: 9001, max: 15000, maxTenureMonths: 4, decision: "MANUAL_REVIEW", approver: "Senior underwriter", requiredChecks: ["Affordability check", "Credit bureau pull", "Bank statement"], minRiskBand: "LOW", progression: "After 3 on-time repayments" },
  { id: "L5", min: 15001, max: 35000, maxTenureMonths: 6, decision: "MANUAL_REVIEW", approver: "Senior underwriter", requiredChecks: ["Affordability check", "Credit bureau pull", "Bank statement", "Income proof"], minRiskBand: "LOW", progression: "Fresh eligibility assessment required" },
];
export const getLevel = (id: string) => loanLevels.find((l) => l.id === id);

export type PolicyVersion = {
  id: string;
  version: string;
  status: "ACTIVE" | "DRAFT" | "SUPERSEDED";
  effectiveFrom: string;
  author: string;
  approvedBy: string;
  summary: string;
  changes: string[];
  decisionsMade: number;
};

export const policies: PolicyVersion[] = [
  { id: "POL-2026-03", version: "3.2", status: "ACTIVE", effectiveFrom: "2026-09-01", author: "Meera Nair", approvedBy: "Admin User", summary: "Current lending policy used by the decision router.", changes: ["Lowered L3 tenure cap from 4 to 3 months", "Bank statement now required from L4"], decisionsMade: 412 },
  { id: "POL-2026-04", version: "3.3", status: "DRAFT", effectiveFrom: "2026-11-01", author: "Meera Nair", approvedBy: "—", summary: "Awaiting second-level approval before it can go live.", changes: ["Add affordability check to L2", "Raise L5 ceiling review threshold"], decisionsMade: 0 },
  { id: "POL-2026-02", version: "3.1", status: "SUPERSEDED", effectiveFrom: "2026-06-15", author: "Meera Nair", approvedBy: "Admin User", summary: "Replaced on 1 Sep 2026. Historical decisions still reference this version.", changes: ["Introduced L5", "Added liveness requirement at L1"], decisionsMade: 986 },
];
export const getPolicy = (id: string) => policies.find((p) => p.id === id);

/* ───────────── Applications & risk ───────────── */

export type Band = "LOW" | "MEDIUM" | "HIGH";

export type Application = {
  id: string;
  customerId: string;
  requested: number;
  eligible: number;
  tenureMonths: number;
  purpose: string;
  submitted: string;
  state: "MANUAL_REVIEW" | "PENDING_EXTERNAL_PROVIDER" | "PENDING_INFORMATION" | "APPROVED" | "REJECTED";
  router: "AUTO_APPROVE" | "MANUAL_REVIEW" | "AUTO_REJECT" | "PENDING_INFORMATION" | "PENDING_PROVIDER";
  recommendedLevel: string;
  assignedTo: string;
  risk: {
    score: number | null; // 0–100, higher is riskier
    band: Band | null;
    dimensions: { name: string; value: string; tone: "ok" | "warn" | "bad" | "neutral" }[];
    positives: string[];
    warnings: string[];
    critical: string[];
  };
  policyVersion: string;
  modelVersion: string;
  /** How far the application has progressed through the lending pipeline (index into PIPELINE). */
  stage: number;
  channel: string;
};

export const PIPELINE = ["Application", "Risk & policy", "Decision", "Offer & KFS", "Agreement e-sign", "Bank verification", "Disbursement"] as const;

export const applications: Application[] = [
  {
    id: "APP-104582", customerId: "CUS-10021", requested: 10000, eligible: 9000, tenureMonths: 3, purpose: "Laptop repair and course fees",
    submitted: "2026-10-13T09:42", state: "MANUAL_REVIEW", router: "MANUAL_REVIEW", recommendedLevel: "L3", assignedTo: "Meera Nair",
    risk: {
      score: 63, band: "MEDIUM",
      dimensions: [
        { name: "Identity", value: "Low", tone: "ok" }, { name: "Fraud", value: "Low", tone: "ok" },
        { name: "Credit", value: "Medium", tone: "warn" }, { name: "Affordability", value: "Review", tone: "warn" },
        { name: "Existing obligations", value: "Medium", tone: "warn" }, { name: "Internal history", value: "New at L3", tone: "neutral" },
      ],
      positives: ["KYC verified", "PAN verified", "Identity information consistent", "No duplicate account detected", "Last loan (LN-30101) repaid on time"],
      warnings: ["Limited credit history", "Existing obligation reported by bureau", "Requested amount above automatic threshold"],
      critical: [],
    },
    policyVersion: "3.2", modelVersion: "rules-1.4", stage: 2, channel: "Android app",
  },
  {
    id: "APP-104583", customerId: "CUS-10022", requested: 5000, eligible: 5000, tenureMonths: 2, purpose: "Exam and travel expenses",
    submitted: "2026-10-13T08:15", state: "PENDING_EXTERNAL_PROVIDER", router: "PENDING_PROVIDER", recommendedLevel: "L2", assignedTo: "—",
    risk: {
      score: null, band: null,
      dimensions: [
        { name: "Identity", value: "Low", tone: "ok" }, { name: "Fraud", value: "Low", tone: "ok" },
        { name: "Credit", value: "Awaiting bureau", tone: "neutral" }, { name: "Affordability", value: "Awaiting bureau", tone: "neutral" },
        { name: "Existing obligations", value: "Awaiting bureau", tone: "neutral" }, { name: "Internal history", value: "1 repaid loan", tone: "ok" },
      ],
      positives: ["KYC verified", "Previous loan repaid on time"],
      warnings: ["Credit bureau response pending (requested 08:16, retry scheduled)"],
      critical: [],
    },
    policyVersion: "3.2", modelVersion: "rules-1.4", stage: 1, channel: "Android app",
  },
  {
    id: "APP-104584", customerId: "CUS-10023", requested: 15000, eligible: 9000, tenureMonths: 4, purpose: "Medical expenses",
    submitted: "2026-10-12T16:35", state: "MANUAL_REVIEW", router: "MANUAL_REVIEW", recommendedLevel: "L3", assignedTo: "Meera Nair",
    risk: {
      score: 72, band: "HIGH",
      dimensions: [
        { name: "Identity", value: "Medium", tone: "warn" }, { name: "Fraud", value: "Medium", tone: "warn" },
        { name: "Credit", value: "Medium", tone: "warn" }, { name: "Affordability", value: "Review", tone: "warn" },
        { name: "Existing obligations", value: "Low", tone: "ok" }, { name: "Internal history", value: "New customer", tone: "neutral" },
      ],
      positives: ["PAN verified", "No existing obligations reported"],
      warnings: ["KYC name differs from PAN name (manual KYC review open)", "Device previously linked to another account", "Requested amount is 1.7× what policy allows for a new customer"],
      critical: [],
    },
    policyVersion: "3.2", modelVersion: "rules-1.4", stage: 2, channel: "Android app",
  },
  {
    id: "APP-104585", customerId: "CUS-10024", requested: 2000, eligible: 2000, tenureMonths: 1, purpose: "Books and stationery",
    submitted: "2026-10-12T13:12", state: "APPROVED", router: "AUTO_APPROVE", recommendedLevel: "L1", assignedTo: "System",
    risk: {
      score: 22, band: "LOW",
      dimensions: [
        { name: "Identity", value: "Low", tone: "ok" }, { name: "Fraud", value: "Low", tone: "ok" },
        { name: "Credit", value: "Low", tone: "ok" }, { name: "Affordability", value: "Pass", tone: "ok" },
        { name: "Existing obligations", value: "Low", tone: "ok" }, { name: "Internal history", value: "New at L1", tone: "neutral" },
      ],
      positives: ["KYC verified", "PAN verified", "Liveness passed", "Amount within L1 automatic limit"],
      warnings: [],
      critical: [],
    },
    policyVersion: "3.2", modelVersion: "rules-1.4", stage: 5, channel: "Android app",
  },
  {
    id: "APP-104586", customerId: "CUS-10025", requested: 35000, eligible: 0, tenureMonths: 6, purpose: "Personal expenses",
    submitted: "2026-10-11T11:05", state: "REJECTED", router: "AUTO_REJECT", recommendedLevel: "—", assignedTo: "System",
    risk: {
      score: 88, band: "HIGH",
      dimensions: [
        { name: "Identity", value: "Low", tone: "ok" }, { name: "Fraud", value: "Low", tone: "ok" },
        { name: "Credit", value: "High", tone: "bad" }, { name: "Affordability", value: "Fail", tone: "bad" },
        { name: "Existing obligations", value: "High", tone: "bad" }, { name: "Internal history", value: "Overdue loan", tone: "bad" },
      ],
      positives: ["KYC verified"],
      warnings: ["Requested amount far above income-based capacity"],
      critical: ["Active loan LN-30102 is 34 days past due"],
    },
    policyVersion: "3.2", modelVersion: "rules-1.4", stage: 2, channel: "Android app",
  },
  {
    id: "APP-104587", customerId: "CUS-10026", requested: 5000, eligible: 5000, tenureMonths: 2, purpose: "Rent top-up",
    submitted: "2026-10-12T10:20", state: "PENDING_INFORMATION", router: "PENDING_INFORMATION", recommendedLevel: "L2", assignedTo: "Meera Nair",
    risk: {
      score: 48, band: "MEDIUM",
      dimensions: [
        { name: "Identity", value: "Low", tone: "ok" }, { name: "Fraud", value: "Low", tone: "ok" },
        { name: "Credit", value: "Medium", tone: "warn" }, { name: "Affordability", value: "Needs data", tone: "warn" },
        { name: "Existing obligations", value: "Low", tone: "ok" }, { name: "Internal history", value: "Active loan, on time", tone: "ok" },
      ],
      positives: ["KYC verified", "Current loan LN-30103 paid on time"],
      warnings: ["Bank statement requested; affordability cannot be assessed yet"],
      critical: [],
    },
    policyVersion: "3.2", modelVersion: "rules-1.4", stage: 2, channel: "Android app",
  },
];
export const getApplication = (id: string) => applications.find((a) => a.id.toLowerCase() === id.toLowerCase());

/* ───────────── KYC ───────────── */

export type KycRecord = {
  id: string;
  customerId: string;
  state: "INITIATED" | "PENDING" | "VERIFIED" | "FAILED" | "MANUAL_REVIEW";
  pan: "VERIFIED" | "FAILED" | "PENDING";
  digilocker: "VERIFIED" | "FAILED" | "PENDING" | "MANUAL_REVIEW";
  liveness: "VERIFIED" | "FAILED" | "PENDING" | "RETRY_REQUIRED" | "MANUAL_REVIEW";
  faceMatch: number | null;
  provider: string;
  flag: string;
  submitted: string;
  attempts: number;
};

export const kycRecords: KycRecord[] = [
  { id: "KYC-2001", customerId: "CUS-10023", state: "MANUAL_REVIEW", pan: "VERIFIED", digilocker: "MANUAL_REVIEW", liveness: "VERIFIED", faceMatch: 81, provider: "DigiLocker (sandbox)", flag: "Name on DigiLocker does not match PAN name", submitted: "2026-10-12T16:20", attempts: 2 },
  { id: "KYC-2002", customerId: "CUS-10022", state: "VERIFIED", pan: "VERIFIED", digilocker: "VERIFIED", liveness: "VERIFIED", faceMatch: 96, provider: "DigiLocker (sandbox)", flag: "None", submitted: "2026-07-05T12:02", attempts: 1 },
  { id: "KYC-2003", customerId: "CUS-10028", state: "PENDING", pan: "VERIFIED", digilocker: "PENDING", liveness: "PENDING", faceMatch: null, provider: "DigiLocker (sandbox)", flag: "Awaiting provider callback", submitted: "2026-10-13T09:05", attempts: 1 },
  { id: "KYC-2004", customerId: "CUS-10027", state: "MANUAL_REVIEW", pan: "VERIFIED", digilocker: "VERIFIED", liveness: "MANUAL_REVIEW", faceMatch: 74, provider: "Liveness provider (sandbox)", flag: "Face match below auto-approve confidence", submitted: "2026-10-12T18:44", attempts: 2 },
  { id: "KYC-2005", customerId: "CUS-10021", state: "VERIFIED", pan: "VERIFIED", digilocker: "VERIFIED", liveness: "VERIFIED", faceMatch: 94, provider: "DigiLocker (sandbox)", flag: "None", submitted: "2026-06-11T10:30", attempts: 1 },
];
export const getKyc = (id: string) => kycRecords.find((k) => k.id.toLowerCase() === id.toLowerCase());

/* ───────────── Fraud ───────────── */

export type FraudCase = {
  id: string;
  applicationId: string;
  customerId: string;
  deviceId: string;
  state: "MANUAL_REVIEW" | "ESCALATED" | "CLEARED";
  band: Band;
  signals: string[];
  raised: string;
  linkedAccounts: string[];
};

export const fraudCases: FraudCase[] = [
  { id: "FRD-3001", applicationId: "APP-104584", customerId: "CUS-10023", deviceId: "DEV-2198", state: "MANUAL_REVIEW", band: "HIGH", signals: ["Device previously linked to another account", "KYC name and PAN name differ", "Application submitted 4 minutes after sign-up"], raised: "2026-10-12T16:40", linkedAccounts: ["CUS-10028"] },
  { id: "FRD-3002", applicationId: "APP-104582", customerId: "CUS-10021", deviceId: "DEV-8821", state: "MANUAL_REVIEW", band: "MEDIUM", signals: ["New device since last loan", "Application velocity above customer average"], raised: "2026-10-13T09:44", linkedAccounts: [] },
  { id: "FRD-3003", applicationId: "APP-104586", customerId: "CUS-10025", deviceId: "DEV-3306", state: "ESCALATED", band: "HIGH", signals: ["Applied for L5 amount while a loan is overdue", "Repeated application attempts after rejection"], raised: "2026-10-11T11:10", linkedAccounts: [] },
  { id: "FRD-3004", applicationId: "APP-104585", customerId: "CUS-10024", deviceId: "DEV-7314", state: "CLEARED", band: "LOW", signals: ["No critical indicators", "Device and identity checks passed"], raised: "2026-10-12T13:13", linkedAccounts: [] },
];
export const getFraud = (id: string) => fraudCases.find((f) => f.id.toLowerCase() === id.toLowerCase());

/* ───────────── Loans, disbursements, payments, reconciliation ───────────── */

export type Loan = {
  id: string;
  applicationId: string | null;
  customerId: string;
  level: string;
  principal: number;
  outstanding: number;
  status: "PENDING_DISBURSEMENT" | "ACTIVE" | "OVERDUE" | "CLOSED";
  disbursedOn: string;
  nextDue: string;
  dpd: number;
  tenureMonths: number;
  installments: { no: number; due: string; amount: number; paid: number; status: "PAID" | "DUE" | "OVERDUE" | "UPCOMING" }[];
};

export const loans: Loan[] = [
  { id: "LN-30101", applicationId: null, customerId: "CUS-10021", level: "L2", principal: 5000, outstanding: 0, status: "CLOSED", disbursedOn: "2026-07-20", nextDue: "—", dpd: 0, tenureMonths: 2, installments: [{ no: 1, due: "2026-08-20", amount: 2600, paid: 2600, status: "PAID" }, { no: 2, due: "2026-09-20", amount: 2600, paid: 2600, status: "PAID" }] },
  { id: "LN-30102", applicationId: null, customerId: "CUS-10025", level: "L3", principal: 9000, outstanding: 6420, status: "OVERDUE", disbursedOn: "2026-07-25", nextDue: "2026-09-09", dpd: 34, tenureMonths: 3, installments: [{ no: 1, due: "2026-08-25", amount: 3100, paid: 3100, status: "PAID" }, { no: 2, due: "2026-09-09", amount: 3100, paid: 0, status: "OVERDUE" }, { no: 3, due: "2026-10-25", amount: 3100, paid: 0, status: "UPCOMING" }] },
  { id: "LN-30103", applicationId: null, customerId: "CUS-10026", level: "L2", principal: 5000, outstanding: 2600, status: "ACTIVE", disbursedOn: "2026-09-21", nextDue: "2026-10-21", dpd: 0, tenureMonths: 2, installments: [{ no: 1, due: "2026-10-21", amount: 2600, paid: 0, status: "DUE" }, { no: 2, due: "2026-11-21", amount: 2600, paid: 0, status: "UPCOMING" }] },
  { id: "LN-30104", applicationId: "APP-104585", customerId: "CUS-10024", level: "L1", principal: 2000, outstanding: 2000, status: "PENDING_DISBURSEMENT", disbursedOn: "—", nextDue: "—", dpd: 0, tenureMonths: 1, installments: [] },
  { id: "LN-30105", applicationId: null, customerId: "CUS-10027", level: "L2", principal: 4000, outstanding: 2160, status: "OVERDUE", disbursedOn: "2026-08-28", nextDue: "2026-09-28", dpd: 15, tenureMonths: 2, installments: [{ no: 1, due: "2026-09-28", amount: 2160, paid: 0, status: "OVERDUE" }, { no: 2, due: "2026-10-28", amount: 2160, paid: 0, status: "UPCOMING" }] },
  { id: "LN-30106", applicationId: null, customerId: "CUS-10028", level: "L1", principal: 2000, outstanding: 2080, status: "OVERDUE", disbursedOn: "2026-09-02", nextDue: "2026-10-02", dpd: 11, tenureMonths: 1, installments: [{ no: 1, due: "2026-10-02", amount: 2080, paid: 0, status: "OVERDUE" }] },
  { id: "LN-30107", applicationId: null, customerId: "CUS-10022", level: "L1", principal: 2000, outstanding: 0, status: "CLOSED", disbursedOn: "2026-07-10", nextDue: "—", dpd: 0, tenureMonths: 1, installments: [{ no: 1, due: "2026-08-10", amount: 2080, paid: 2080, status: "PAID" }] },
];
export const getLoan = (id: string) => loans.find((l) => l.id.toLowerCase() === id.toLowerCase());

export type Disbursement = {
  id: string;
  loanId: string;
  customerId: string;
  amount: number;
  status: "PENDING" | "PROCESSING" | "SUCCESS" | "FAILED" | "REQUIRES_REVIEW" | "REVERSED";
  created: string;
  idempotencyKey: string;
  providerRef: string;
  bank: string;
  account: string;
  ifsc: string;
  nameMatch: number; // % similarity of bank holder name vs verified identity
  attempts: number;
  failureReason: string;
  checks: { label: string; ok: boolean }[];
};

const allChecks = (over: Partial<Record<string, boolean>> = {}) =>
  [
    ["Offer accepted by customer", true],
    ["KFS acknowledged", true],
    ["Loan agreement e-signed", true],
    ["Bank account verified", true],
    ["Account holder name matches identity", true],
    ["No open fraud case", true],
  ].map(([label, ok]) => ({ label: label as string, ok: over[label as string] ?? (ok as boolean) }));

export const disbursements: Disbursement[] = [
  { id: "DSB-5001", loanId: "LN-30104", customerId: "CUS-10024", amount: 2000, status: "PENDING", created: "2026-10-13T09:58", idempotencyKey: "dsb-LN-30104-v1", providerRef: "—", bank: "State Bank of India", account: "••••4471", ifsc: "SBIN0001234", nameMatch: 97, attempts: 0, failureReason: "", checks: allChecks() },
  { id: "DSB-5002", loanId: "LN-30103", customerId: "CUS-10026", amount: 5000, status: "SUCCESS", created: "2026-09-21T11:20", idempotencyKey: "dsb-LN-30103-v1", providerRef: "SBX-77120031", bank: "HDFC Bank", account: "••••9028", ifsc: "HDFC0004321", nameMatch: 100, attempts: 1, failureReason: "", checks: allChecks() },
  { id: "DSB-5003", loanId: "LN-30106", customerId: "CUS-10028", amount: 2000, status: "PROCESSING", created: "2026-10-13T10:12", idempotencyKey: "dsb-LN-30106-v1", providerRef: "SBX-77129954", bank: "Axis Bank", account: "••••3310", ifsc: "UTIB0000987", nameMatch: 94, attempts: 1, failureReason: "", checks: allChecks() },
  { id: "DSB-5004", loanId: "LN-30105", customerId: "CUS-10027", amount: 4000, status: "REQUIRES_REVIEW", created: "2026-08-28T15:41", idempotencyKey: "dsb-LN-30105-v1", providerRef: "SBX-76420118", bank: "ICICI Bank", account: "••••6602", ifsc: "ICIC0002145", nameMatch: 71, attempts: 1, failureReason: "Provider returned success but bank credit not confirmed after 24h", checks: allChecks({ "Account holder name matches identity": false }) },
  { id: "DSB-5005", loanId: "LN-30102", customerId: "CUS-10025", amount: 9000, status: "FAILED", created: "2026-07-25T10:02", idempotencyKey: "dsb-LN-30102-v1", providerRef: "SBX-75203310", bank: "Punjab National Bank", account: "••••1187", ifsc: "PUNB0123400", nameMatch: 99, attempts: 2, failureReason: "Beneficiary bank unavailable (second attempt succeeded under DSB-5005-r2)", checks: allChecks() },
];
export const getDisbursement = (id: string) => disbursements.find((d) => d.id.toLowerCase() === id.toLowerCase());

export type Payment = {
  id: string;
  loanId: string;
  customerId: string;
  amount: number;
  status: "SUCCESS" | "FAILED" | "PENDING";
  method: "UPI" | "UPI AutoPay" | "NACH" | "Gateway";
  providerRef: string;
  date: string;
  installment: number;
  webhook: "VERIFIED" | "AWAITING" | "REJECTED";
};

export const payments: Payment[] = [
  { id: "PAY-7001", loanId: "LN-30101", customerId: "CUS-10021", amount: 2600, status: "SUCCESS", method: "UPI", providerRef: "UPI-9012211", date: "2026-09-20", installment: 2, webhook: "VERIFIED" },
  { id: "PAY-7002", loanId: "LN-30102", customerId: "CUS-10025", amount: 3100, status: "FAILED", method: "NACH", providerRef: "NACH-5530021", date: "2026-09-09", installment: 2, webhook: "VERIFIED" },
  { id: "PAY-7003", loanId: "LN-30103", customerId: "CUS-10026", amount: 2600, status: "PENDING", method: "UPI AutoPay", providerRef: "UPI-9033871", date: "2026-10-13", installment: 1, webhook: "AWAITING" },
  { id: "PAY-7004", loanId: "LN-30105", customerId: "CUS-10027", amount: 2160, status: "FAILED", method: "UPI", providerRef: "UPI-9019944", date: "2026-09-28", installment: 1, webhook: "VERIFIED" },
  { id: "PAY-7005", loanId: "LN-30107", customerId: "CUS-10022", amount: 2080, status: "SUCCESS", method: "Gateway", providerRef: "GW-4410982", date: "2026-08-10", installment: 1, webhook: "VERIFIED" },
];

export type Reconciliation = {
  id: string;
  txnId: string;
  type: "DISBURSEMENT" | "PAYMENT";
  ledger: number;
  provider: number;
  bank: number;
  status: "MATCHED" | "MISMATCH" | "RESOLVED";
  date: string;
  note: string;
};

export const reconciliations: Reconciliation[] = [
  { id: "REC-6001", txnId: "DSB-5002", type: "DISBURSEMENT", ledger: 5000, provider: 5000, bank: 5000, status: "MATCHED", date: "2026-09-21", note: "" },
  { id: "REC-6002", txnId: "DSB-5004", type: "DISBURSEMENT", ledger: 4000, provider: 4000, bank: 0, status: "MISMATCH", date: "2026-08-29", note: "Provider shows success but no bank credit has been reported." },
  { id: "REC-6003", txnId: "PAY-7004", type: "PAYMENT", ledger: 2160, provider: 0, bank: 0, status: "MISMATCH", date: "2026-09-28", note: "Ledger holds a pending entry; provider reports a failed attempt." },
  { id: "REC-6004", txnId: "PAY-7001", type: "PAYMENT", ledger: 2600, provider: 2600, bank: 2600, status: "MATCHED", date: "2026-09-20", note: "" },
  { id: "REC-6005", txnId: "PAY-7005", type: "PAYMENT", ledger: 2080, provider: 2080, bank: 2050, status: "RESOLVED", date: "2026-08-11", note: "₹30 gateway fee netted in settlement; adjustment entry LED-88213 posted." },
];
export const getReconciliation = (id: string) => reconciliations.find((r) => r.id.toLowerCase() === id.toLowerCase());

/* ───────────── Collections ───────────── */

export type CollectionCase = {
  id: string;
  loanId: string;
  customerId: string;
  overdue: number;
  dpd: number;
  stage: "REMINDER" | "FOLLOW_UP" | "ESCALATED" | "PROMISE_TO_PAY" | "RESOLVED";
  agent: string;
  lastContact: string;
  promiseDate: string;
  events: { at: string; channel: string; note: string }[];
};

export const collectionCases: CollectionCase[] = [
  { id: "COL-8001", loanId: "LN-30102", customerId: "CUS-10025", overdue: 3100, dpd: 34, stage: "ESCALATED", agent: "Rahul Das", lastContact: "2026-10-10", promiseDate: "—", events: [{ at: "2026-09-10T09:00", channel: "SMS", note: "Payment reminder sent" }, { at: "2026-09-18T11:20", channel: "Call", note: "Customer acknowledged dues; no commitment" }, { at: "2026-10-10T10:05", channel: "Call", note: "Escalated to senior agent after two missed commitments" }] },
  { id: "COL-8002", loanId: "LN-30105", customerId: "CUS-10027", overdue: 2160, dpd: 15, stage: "PROMISE_TO_PAY", agent: "Ananya Roy", lastContact: "2026-10-12", promiseDate: "2026-10-15", events: [{ at: "2026-09-29T09:00", channel: "SMS", note: "Payment reminder sent" }, { at: "2026-10-12T15:30", channel: "Call", note: "Customer promised to pay on 15 Oct (payment link shared)" }] },
  { id: "COL-8003", loanId: "LN-30106", customerId: "CUS-10028", overdue: 2080, dpd: 11, stage: "FOLLOW_UP", agent: "Ananya Roy", lastContact: "2026-10-09", promiseDate: "—", events: [{ at: "2026-10-03T09:00", channel: "SMS", note: "Payment reminder sent" }, { at: "2026-10-09T12:45", channel: "Email", note: "Reminder with repayment link sent" }] },
  { id: "COL-8004", loanId: "LN-30103", customerId: "CUS-10026", overdue: 0, dpd: 0, stage: "REMINDER", agent: "System", lastContact: "2026-10-13", promiseDate: "—", events: [{ at: "2026-10-13T08:00", channel: "Push", note: "Upcoming instalment reminder (due 21 Oct)" }] },
];
export const getCase = (id: string) => collectionCases.find((c) => c.id.toLowerCase() === id.toLowerCase());

/* ───────────── Support & complaints ───────────── */

export type Ticket = {
  id: string;
  customerId: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "WAITING_ON_CUSTOMER" | "RESOLVED";
  assignee: string;
  created: string;
  slaDue: string;
  messages: { from: "customer" | "agent"; name: string; at: string; text: string }[];
};

export const tickets: Ticket[] = [
  { id: "TKT-4001", customerId: "CUS-10026", subject: "Autopay debited twice this month", category: "Repayment", priority: "HIGH", status: "OPEN", assignee: "Ishita Rao", created: "2026-10-13T08:40", slaDue: "2026-10-13T16:40", messages: [{ from: "customer", name: "Vikram Rao", at: "2026-10-13T08:40", text: "My account shows two debits for the same instalment. Please check." }] },
  { id: "TKT-4002", customerId: "CUS-10022", subject: "How do I update my bank account?", category: "Account", priority: "LOW", status: "WAITING_ON_CUSTOMER", assignee: "Ishita Rao", created: "2026-10-12T12:10", slaDue: "2026-10-14T12:10", messages: [{ from: "customer", name: "Priya Verma", at: "2026-10-12T12:10", text: "I changed my bank. How can I add the new account?" }, { from: "agent", name: "Ishita Rao", at: "2026-10-12T13:02", text: "You can add a new account from Profile > Bank accounts. We will verify it before the next disbursement. Could you confirm the last four digits of the new account?" }] },
  { id: "TKT-4003", customerId: "CUS-10024", subject: "Offer not visible in the app", category: "Application", priority: "MEDIUM", status: "IN_PROGRESS", assignee: "Ishita Rao", created: "2026-10-12T14:30", slaDue: "2026-10-13T14:30", messages: [{ from: "customer", name: "Neha Singh", at: "2026-10-12T14:30", text: "My application says approved but I cannot see the offer." }, { from: "agent", name: "Ishita Rao", at: "2026-10-12T15:00", text: "Thanks for reporting this. We are checking the offer generation job." }] },
  { id: "TKT-4004", customerId: "CUS-10021", subject: "Receipt for last repayment", category: "Documents", priority: "LOW", status: "RESOLVED", assignee: "Ishita Rao", created: "2026-10-01T10:00", slaDue: "2026-10-03T10:00", messages: [{ from: "customer", name: "Aarav Sharma", at: "2026-10-01T10:00", text: "Can I get the receipt for my last payment?" }, { from: "agent", name: "Ishita Rao", at: "2026-10-01T10:25", text: "Receipt sent to your registered email." }] },
];
export const getTicket = (id: string) => tickets.find((t) => t.id.toLowerCase() === id.toLowerCase());

export type Complaint = {
  id: string;
  customerId: string;
  subject: string;
  category: string;
  status: "OPEN" | "IN_PROGRESS" | "ESCALATED" | "RESOLVED";
  level: 1 | 2 | 3;
  received: string;
  slaDue: string;
  owner: string;
  description: string;
  history: { at: string; title: string; note: string }[];
};

export const complaints: Complaint[] = [
  { id: "CMP-9001", customerId: "CUS-10027", subject: "Collection calls outside permitted hours", category: "Collections conduct", status: "ESCALATED", level: 2, received: "2026-10-09", slaDue: "2026-10-16", owner: "Nodal officer", description: "Customer reports a call received after 8 pm on 8 Oct.", history: [{ at: "2026-10-09T10:00", title: "Complaint received", note: "Logged from in-app support" }, { at: "2026-10-10T11:30", title: "Escalated to level 2", note: "Allegation concerns collections conduct; call logs requested" }] },
  { id: "CMP-9002", customerId: "CUS-10025", subject: "Penalty charge disputed", category: "Charges", status: "IN_PROGRESS", level: 1, received: "2026-10-05", slaDue: "2026-10-19", owner: "Ishita Rao", description: "Customer disputes the late fee applied to LN-30102.", history: [{ at: "2026-10-05T09:15", title: "Complaint received", note: "Logged by support" }, { at: "2026-10-07T14:00", title: "Under review", note: "Fee calculation being verified against the loan agreement" }] },
  { id: "CMP-9003", customerId: "CUS-10022", subject: "Application rejected without explanation", category: "Decision", status: "RESOLVED", level: 1, received: "2026-09-18", slaDue: "2026-10-02", owner: "Ishita Rao", description: "Customer asked why an earlier application was declined.", history: [{ at: "2026-09-18T11:00", title: "Complaint received", note: "Logged by support" }, { at: "2026-09-24T16:20", title: "Resolved", note: "Customer informed of the main reasons and how to reapply" }] },
];
export const getComplaint = (id: string) => complaints.find((c) => c.id.toLowerCase() === id.toLowerCase());

/* ───────────── Audit ───────────── */

export type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  requestId: string;
  ip: string;
  reason: string;
  before: string;
  after: string;
};

export const auditEvents: AuditEvent[] = [
  { id: "AUD-90112", at: "2026-10-13T10:12", actor: "Meera Nair", role: "Senior underwriter", action: "APPLICATION_ASSIGNED", entity: "Application", entityId: "APP-104582", requestId: "req_8f21c9", ip: "10.20.4.18", reason: "—", before: "unassigned", after: "Meera Nair" },
  { id: "AUD-90111", at: "2026-10-13T09:58", actor: "System", role: "Decision router", action: "LOAN_READY_FOR_DISBURSEMENT", entity: "Loan", entityId: "LN-30104", requestId: "req_8f1a07", ip: "—", reason: "All pre-disbursement checks passed", before: "BANK_VERIFIED", after: "READY_FOR_DISBURSEMENT" },
  { id: "AUD-90108", at: "2026-10-12T15:02", actor: "Admin User", role: "Super admin", action: "SENSITIVE_DATA_VIEWED", entity: "Customer", entityId: "CUS-10023", requestId: "req_7d9e44", ip: "10.20.4.9", reason: "KYC name mismatch review", before: "—", after: "PAN (unmasked)" },
  { id: "AUD-90102", at: "2026-10-12T13:12", actor: "System", role: "Decision router", action: "APPLICATION_AUTO_APPROVED", entity: "Application", entityId: "APP-104585", requestId: "req_7c55b2", ip: "—", reason: "Policy 3.2, L1 within automatic limit", before: "PROCESSING", after: "APPROVED" },
  { id: "AUD-90097", at: "2026-10-11T11:05", actor: "System", role: "Decision router", action: "APPLICATION_AUTO_REJECTED", entity: "Application", entityId: "APP-104586", requestId: "req_7b01aa", ip: "—", reason: "Active loan overdue (policy rule R-14)", before: "PROCESSING", after: "REJECTED" },
  { id: "AUD-90090", at: "2026-10-10T10:05", actor: "Rahul Das", role: "Collections agent", action: "COLLECTION_CASE_ESCALATED", entity: "Collection case", entityId: "COL-8001", requestId: "req_79c3d0", ip: "10.20.4.31", reason: "Two missed commitments", before: "FOLLOW_UP", after: "ESCALATED" },
  { id: "AUD-90071", at: "2026-10-08T17:40", actor: "Admin User", role: "Super admin", action: "POLICY_DRAFT_CREATED", entity: "Policy", entityId: "POL-2026-04", requestId: "req_7220be", ip: "10.20.4.9", reason: "Quarterly credit policy review", before: "—", after: "Version 3.3 (draft)" },
  { id: "AUD-90049", at: "2026-10-05T09:20", actor: "Admin User", role: "Super admin", action: "ROLE_PERMISSIONS_CHANGED", entity: "Role", entityId: "COLLECTIONS_AGENT", requestId: "req_6b8e13", ip: "10.20.4.9", reason: "Remove access to sensitive identity data", before: "view_sensitive_identity", after: "—" },
];

/* ───────────── Admin users & roles ───────────── */

export const PERMISSIONS: { id: string; label: string; group: string }[] = [
  { id: "view_customer", label: "View customers", group: "Customers" },
  { id: "view_sensitive_identity", label: "View sensitive identity data", group: "Customers" },
  { id: "view_risk", label: "View risk assessments", group: "Underwriting" },
  { id: "approve_loan", label: "Approve loans", group: "Underwriting" },
  { id: "reject_loan", label: "Reject loans", group: "Underwriting" },
  { id: "override_policy", label: "Override policy (needs second approval)", group: "Underwriting" },
  { id: "review_kyc", label: "Review KYC", group: "Underwriting" },
  { id: "review_fraud", label: "Review fraud cases", group: "Underwriting" },
  { id: "release_disbursement", label: "Release disbursements", group: "Money" },
  { id: "view_ledger", label: "View ledger", group: "Money" },
  { id: "perform_reconciliation", label: "Perform reconciliation", group: "Money" },
  { id: "manage_collections", label: "Manage collections", group: "Servicing" },
  { id: "manage_support", label: "Manage support and complaints", group: "Servicing" },
  { id: "view_reports", label: "View reports", group: "Insights" },
  { id: "view_audit_log", label: "View audit log", group: "Insights" },
  { id: "change_policy", label: "Change lending policy", group: "Administration" },
  { id: "manage_users", label: "Manage admin users", group: "Administration" },
  { id: "manage_roles", label: "Manage roles", group: "Administration" },
];

export type Role = { id: string; name: string; description: string; permissions: string[] };

const ALL = PERMISSIONS.map((p) => p.id);

export const roles: Role[] = [
  { id: "SUPER_ADMIN", name: "Super admin", description: "Full access. Policy and money actions still follow maker-checker rules.", permissions: ALL },
  { id: "CREDIT_POLICY_ADMIN", name: "Credit policy admin", description: "Maintains versioned lending policy and loan levels.", permissions: ["view_customer", "view_risk", "change_policy", "view_reports", "view_audit_log"] },
  { id: "SENIOR_UNDERWRITER", name: "Senior underwriter", description: "Reviews higher-value applications and approves limited overrides.", permissions: ["view_customer", "view_sensitive_identity", "view_risk", "approve_loan", "reject_loan", "override_policy", "view_reports"] },
  { id: "UNDERWRITER", name: "Underwriter", description: "Reviews and decides applications within policy.", permissions: ["view_customer", "view_risk", "approve_loan", "reject_loan"] },
  { id: "KYC_REVIEWER", name: "KYC reviewer", description: "Resolves KYC and liveness exceptions.", permissions: ["view_customer", "view_sensitive_identity", "review_kyc"] },
  { id: "FRAUD_REVIEWER", name: "Fraud reviewer", description: "Investigates fraud signals and linked accounts.", permissions: ["view_customer", "view_risk", "review_fraud"] },
  { id: "COLLECTIONS_AGENT", name: "Collections agent", description: "Works overdue cases within conduct rules.", permissions: ["view_customer", "manage_collections"] },
  { id: "CUSTOMER_SUPPORT", name: "Customer support", description: "Handles tickets and complaints. Cannot approve loans or change policy.", permissions: ["view_customer", "manage_support"] },
  { id: "FINANCE", name: "Finance / reconciliation", description: "Releases payouts, reviews the ledger and reconciles.", permissions: ["view_customer", "release_disbursement", "view_ledger", "perform_reconciliation", "view_reports"] },
  { id: "AUDITOR", name: "Auditor", description: "Read-only access to audit trail and reports.", permissions: ["view_audit_log", "view_reports", "view_ledger"] },
  { id: "READ_ONLY", name: "Read only", description: "View dashboards and non-sensitive data.", permissions: ["view_customer", "view_reports"] },
];

export type AdminUser = { id: string; name: string; email: string; role: string; status: "ACTIVE" | "INACTIVE"; lastActive: string; mfa: boolean };

export const adminUsers: AdminUser[] = [
  { id: "ADM-001", name: "Admin User", email: "admin@inpockets.in", role: "SUPER_ADMIN", status: "ACTIVE", lastActive: "2026-10-13T10:20", mfa: true },
  { id: "ADM-002", name: "Meera Nair", email: "meera.nair@inpockets.in", role: "SENIOR_UNDERWRITER", status: "ACTIVE", lastActive: "2026-10-13T10:12", mfa: true },
  { id: "ADM-003", name: "Tarun Bose", email: "tarun.bose@inpockets.in", role: "KYC_REVIEWER", status: "ACTIVE", lastActive: "2026-10-12T18:02", mfa: true },
  { id: "ADM-004", name: "Rahul Das", email: "rahul.das@inpockets.in", role: "COLLECTIONS_AGENT", status: "ACTIVE", lastActive: "2026-10-13T09:30", mfa: false },
  { id: "ADM-005", name: "Ishita Rao", email: "ishita.rao@inpockets.in", role: "CUSTOMER_SUPPORT", status: "ACTIVE", lastActive: "2026-10-13T10:05", mfa: true },
  { id: "ADM-006", name: "Kabir Anand", email: "kabir.anand@inpockets.in", role: "FINANCE", status: "INACTIVE", lastActive: "2026-09-02T12:40", mfa: true },
];

/* ───────────── Reports ───────────── */

export const reportMonths = [
  { month: "May", applications: 96, approved: 61, disbursed: 248000 },
  { month: "Jun", applications: 142, approved: 94, disbursed: 361000 },
  { month: "Jul", applications: 188, approved: 121, disbursed: 497000 },
  { month: "Aug", applications: 231, approved: 148, disbursed: 632000 },
  { month: "Sep", applications: 276, approved: 171, disbursed: 774000 },
  { month: "Oct", applications: 118, approved: 74, disbursed: 331000 },
];

export const dpdBuckets = [
  { label: "Current", loans: 214, amount: 668000 },
  { label: "1–7 days", loans: 18, amount: 49200 },
  { label: "8–30 days", loans: 11, amount: 36800 },
  { label: "31–60 days", loans: 6, amount: 31900 },
  { label: "60+ days", loans: 3, amount: 20400 },
];

export const riskDistribution = [
  { band: "Low", share: 41 },
  { band: "Medium", share: 38 },
  { band: "High", share: 21 },
];

export const providerHealth = [
  { name: "SMS / OTP", status: "OK", failures: 3, p95: "1.2s" },
  { name: "PAN verification", status: "OK", failures: 1, p95: "0.9s" },
  { name: "DigiLocker", status: "DEGRADED", failures: 14, p95: "6.8s" },
  { name: "Liveness", status: "OK", failures: 4, p95: "2.1s" },
  { name: "Credit bureau", status: "DEGRADED", failures: 9, p95: "5.4s" },
  { name: "Payouts", status: "OK", failures: 2, p95: "1.7s" },
];
