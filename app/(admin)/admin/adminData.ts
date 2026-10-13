export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
};

export const permissions = [
  "view_customers",
  "review_applications",
  "review_kyc",
  "manage_collections",
  "manage_support",
  "view_loans",
  "view_payments",
  "perform_reconciliation",
  "change_policy",
  "manage_roles",
  "manage_users",
  "view_audit_log",
  "view_reports",
] as const;

export const roles: Role[] = [
  {
    id: "SUPER_ADMIN",
    name: "Super Admin",
    description: "Full access to the admin panel.",
    permissions: [...permissions],
  },
  {
    id: "UNDERWRITER",
    name: "Underwriter",
    description: "Reviews loan applications and customer information.",
    permissions: [
      "view_customers",
      "review_applications",
      "view_reports",
    ],
  },
  {
    id: "KYC_REVIEWER",
    name: "KYC Reviewer",
    description: "Reviews KYC records and related customer information.",
    permissions: ["view_customers", "review_kyc"],
  },
  {
    id: "COLLECTIONS_AGENT",
    name: "Collections Agent",
    description: "Handles overdue collection cases.",
    permissions: ["manage_collections"],
  },
  {
    id: "CUSTOMER_SUPPORT",
    name: "Customer Support",
    description: "Handles support tickets and customer queries.",
    permissions: ["view_customers", "manage_support"],
  },
  {
    id: "FINANCE",
    name: "Finance / Reconciliation",
    description: "Monitors loans, payments, and reconciliation.",
    permissions: [
      "view_loans",
      "view_payments",
      "perform_reconciliation",
    ],
  },
  {
    id: "AUDITOR",
    name: "Auditor",
    description: "Read-only access to audit and reporting information.",
    permissions: ["view_audit_log", "view_reports"],
  },
  {
    id: "READ_ONLY",
    name: "Read Only",
    description: "View access without administrative actions.",
    permissions: ["view_customers", "view_reports"],
  },
];

export const adminUsers: AdminUser[] = [
  {
    id: "ADM-1001",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    role: "SUPER_ADMIN",
    status: "Active",
  },
  {
    id: "ADM-1002",
    name: "Priya Mehta",
    email: "priya.mehta@example.com",
    role: "UNDERWRITER",
    status: "Active",
  },
  {
    id: "ADM-1003",
    name: "Rohan Verma",
    email: "rohan.verma@example.com",
    role: "KYC_REVIEWER",
    status: "Active",
  },
  {
    id: "ADM-1004",
    name: "Neha Singh",
    email: "neha.singh@example.com",
    role: "CUSTOMER_SUPPORT",
    status: "Active",
  },
  {
    id: "ADM-1005",
    name: "Vikram Rao",
    email: "vikram.rao@example.com",
    role: "AUDITOR",
    status: "Inactive",
  },
];