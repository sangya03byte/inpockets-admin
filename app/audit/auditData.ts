export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  reason: string;
};

export const auditLogs: AuditLog[] = [
  {
    id: "AUD-1001",
    actor: "Aarav Sharma",
    action: "ROLE_CHANGED",
    entity: "Admin User",
    entityId: "ADM-1002",
    timestamp: "2026-10-06 10:15",
    reason: "Role update for access review",
  },
  {
    id: "AUD-1002",
    actor: "Priya Mehta",
    action: "APPLICATION_APPROVED",
    entity: "Loan Application",
    entityId: "APP-1001",
    timestamp: "2026-10-06 11:32",
    reason: "Application met underwriting requirements.",
  },
  {
    id: "AUD-1003",
    actor: "Rohan Verma",
    action: "KYC_REVIEWED",
    entity: "KYC Record",
    entityId: "KYC-1003",
    timestamp: "2026-10-06 12:08",
    reason: "Identity documents verified.",
  },
  {
    id: "AUD-1004",
    actor: "Neha Singh",
    action: "COLLECTION_ESCALATED",
    entity: "Collection Account",
    entityId: "ACC-1004",
    timestamp: "2026-10-06 13:45",
    reason: "Customer account requires senior review.",
  },
  {
    id: "AUD-1005",
    actor: "Vikram Rao",
    action: "POLICY_ACTIVATED",
    entity: "Policy",
    entityId: "POL-1002",
    timestamp: "2026-10-06 15:20",
    reason: "Approved policy configuration is ready for activation.",
  },
];