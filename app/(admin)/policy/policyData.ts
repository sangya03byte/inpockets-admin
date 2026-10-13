export type PolicyStatus = "Active" | "Draft" | "Archived";

export type PolicyRecord = {
  policyId: string;
  name: string;
  category: string;
  version: string;
  status: PolicyStatus;
  description: string;
  effectiveDate: string;
  lastUpdated: string;
  updatedBy: string;
  reviewFrequency: string;
  configuration: {
    minLoanAmount: number;
    maxLoanAmount: number;
    maxTenureMonths: number;
    minIncome: number;
    maxExistingEmiRatio: number;
  };
};

export const policyRecords: PolicyRecord[] = [
  {
    policyId: "POL-1001",
    name: "Personal Loan Policy",
    category: "Lending",
    version: "v3.2",
    status: "Active",
    description:
      "Current underwriting rules and eligibility limits for personal loan applications.",
    effectiveDate: "01 Sep 2026",
    lastUpdated: "20 Sep 2026",
    updatedBy: "Policy Admin",
    reviewFrequency: "Quarterly",
    configuration: {
      minLoanAmount: 50000,
      maxLoanAmount: 1000000,
      maxTenureMonths: 60,
      minIncome: 25000,
      maxExistingEmiRatio: 50,
    },
  },
  {
    policyId: "POL-1002",
    name: "KYC Verification Policy",
    category: "KYC",
    version: "v2.1",
    status: "Active",
    description:
      "Rules governing KYC verification, document requirements, and manual review triggers.",
    effectiveDate: "15 Aug 2026",
    lastUpdated: "18 Sep 2026",
    updatedBy: "KYC Policy Admin",
    reviewFrequency: "Monthly",
    configuration: {
      minLoanAmount: 0,
      maxLoanAmount: 0,
      maxTenureMonths: 0,
      minIncome: 0,
      maxExistingEmiRatio: 0,
    },
  },
  {
    policyId: "POL-1003",
    name: "Manual Review Policy",
    category: "Underwriting",
    version: "v1.4",
    status: "Active",
    description:
      "Conditions that route applications to manual underwriting review.",
    effectiveDate: "10 Sep 2026",
    lastUpdated: "22 Sep 2026",
    updatedBy: "Senior Underwriter",
    reviewFrequency: "Monthly",
    configuration: {
      minLoanAmount: 100000,
      maxLoanAmount: 750000,
      maxTenureMonths: 48,
      minIncome: 30000,
      maxExistingEmiRatio: 45,
    },
  },
  {
    policyId: "POL-1004",
    name: "Collections Policy",
    category: "Collections",
    version: "v2.0",
    status: "Draft",
    description:
      "Proposed rules for overdue accounts, promise-to-pay handling, and escalation.",
    effectiveDate: "01 Oct 2026",
    lastUpdated: "25 Sep 2026",
    updatedBy: "Collections Admin",
    reviewFrequency: "Quarterly",
    configuration: {
      minLoanAmount: 0,
      maxLoanAmount: 0,
      maxTenureMonths: 0,
      minIncome: 0,
      maxExistingEmiRatio: 0,
    },
  },
  {
    policyId: "POL-1005",
    name: "Legacy Loan Policy",
    category: "Lending",
    version: "v1.8",
    status: "Archived",
    description:
      "Previous lending policy retained for historical reference and audit purposes.",
    effectiveDate: "01 Jan 2026",
    lastUpdated: "31 Aug 2026",
    updatedBy: "Policy Admin",
    reviewFrequency: "Archived",
    configuration: {
      minLoanAmount: 25000,
      maxLoanAmount: 500000,
      maxTenureMonths: 36,
      minIncome: 20000,
      maxExistingEmiRatio: 55,
    },
  },
];