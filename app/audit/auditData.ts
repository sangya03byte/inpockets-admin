export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  reason: string;
};

export const auditEntries: AuditEntry[] = [
  {
    id: "AUD-1001",
    actor: "Aarav Sharma",
    action: "APPROVE_APPLICATION",
    entity: "Loan Application",
    entityId: "APP-1001",
    timestamp: "2026-09-30 09:42",
    reason: "Application met underwriting requirements after manual review.",
  },
  {
    id: "AUD-1002",
    actor: "Priya Mehta",
    action: "REJECT_APPLICATION",
    entity: "Loan Application",
    entityId: "APP-1003",
    timestamp: "2026-09-30 09:18",
    reason: "Application did not meet the required eligibility criteria.",
  },
  {
    id: "AUD-1003",
    actor: "Rohan Verma",
    action: "APPROVE_KYC",
    entity: "KYC Record",
    entityId: "KYC-1002",
    timestamp: "2026-09-30 08:56",
    reason: "Identity information was verified successfully.",
  },
  {
    id: "AUD-1004",
    actor: "Neha Singh",
    action: "RESOLVE_TICKET",
    entity: "Support Ticket",
    entityId: "TKT-1004",
    timestamp: "2026-09-29 17:35",
    reason: "Customer issue was resolved and confirmation was recorded.",
  },
  {
    id: "AUD-1005",
    actor: "Vikram Rao",
    action: "VIEW_CUSTOMER",
    entity: "Customer",
    entityId: "CUS-1003",
    timestamp: "2026-09-29 16:21",
    reason: "Customer record accessed for audit review.",
  },
  {
    id: "AUD-1006",
    actor: "Aarav Sharma",
    action: "ACTIVATE_POLICY",
    entity: "Policy",
    entityId: "POL-1002",
    timestamp: "2026-09-29 15:48",
    reason: "Updated policy version approved for activation.",
  },
  {
    id: "AUD-1007",
    actor: "Priya Mehta",
    action: "ESCALATE_APPLICATION",
    entity: "Loan Application",
    entityId: "APP-1005",
    timestamp: "2026-09-29 14:12",
    reason: "Additional underwriting review was required.",
  },
  {
    id: "AUD-1008",
    actor: "Rohan Verma",
    action: "REJECT_KYC",
    entity: "KYC Record",
    entityId: "KYC-1004",
    timestamp: "2026-09-29 12:47",
    reason: "Submitted identity information could not be verified.",
  },
];