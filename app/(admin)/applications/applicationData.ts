export type ApplicationStatus =
  | "Manual Review"
  | "Pending Provider"
  | "Approved"
  | "Rejected";

export type ApplicationState =
  | "MANUAL_REVIEW"
  | "PENDING_EXTERNAL_PROVIDER"
  | "APPROVED"
  | "REJECTED";

export type ApplicationRecord = {
  applicationId: string;
  customerId: string;
  customerName: string;
  loanType: string;
  requestedAmount: number;
  tenureMonths: number;
  status: ApplicationStatus;
  state: ApplicationState;
  submitted: string;
  purpose: string;
  employmentType: string;
  monthlyIncome: number;
  existingEmi: number;
  reviewFlag: string;
};

export const applicationRecords: ApplicationRecord[] = [
  {
    applicationId: "APP-1001",
    customerId: "CUS-1001",
    customerName: "Aarav Sharma",
    loanType: "Personal Loan",
    requestedAmount: 250000,
    tenureMonths: 24,
    status: "Manual Review",
    state: "MANUAL_REVIEW",
    submitted: "25 Sep 2026, 09:42 AM",
    purpose: "Medical expenses",
    employmentType: "Salaried",
    monthlyIncome: 62000,
    existingEmi: 8500,
    reviewFlag: "Income verification requires manual review.",
  },
  {
    applicationId: "APP-1002",
    customerId: "CUS-1002",
    customerName: "Priya Verma",
    loanType: "Education Loan",
    requestedAmount: 400000,
    tenureMonths: 36,
    status: "Pending Provider",
    state: "PENDING_EXTERNAL_PROVIDER",
    submitted: "25 Sep 2026, 10:18 AM",
    purpose: "Higher education",
    employmentType: "Self-employed",
    monthlyIncome: 78000,
    existingEmi: 12000,
    reviewFlag: "External verification is still pending.",
  },
  {
    applicationId: "APP-1003",
    customerId: "CUS-1003",
    customerName: "Rohan Patel",
    loanType: "Personal Loan",
    requestedAmount: 150000,
    tenureMonths: 18,
    status: "Manual Review",
    state: "MANUAL_REVIEW",
    submitted: "24 Sep 2026, 04:35 PM",
    purpose: "Home renovation",
    employmentType: "Salaried",
    monthlyIncome: 54000,
    existingEmi: 6500,
    reviewFlag: "Application requires underwriting review.",
  },
  {
    applicationId: "APP-1004",
    customerId: "CUS-1004",
    customerName: "Neha Singh",
    loanType: "Business Loan",
    requestedAmount: 600000,
    tenureMonths: 48,
    status: "Approved",
    state: "APPROVED",
    submitted: "23 Sep 2026, 01:12 PM",
    purpose: "Business expansion",
    employmentType: "Self-employed",
    monthlyIncome: 125000,
    existingEmi: 18000,
    reviewFlag: "Application cleared review.",
  },
  {
    applicationId: "APP-1005",
    customerId: "CUS-1005",
    customerName: "Karan Mehta",
    loanType: "Personal Loan",
    requestedAmount: 200000,
    tenureMonths: 24,
    status: "Rejected",
    state: "REJECTED",
    submitted: "22 Sep 2026, 11:05 AM",
    purpose: "Debt consolidation",
    employmentType: "Salaried",
    monthlyIncome: 39000,
    existingEmi: 17500,
    reviewFlag: "Application did not meet current underwriting requirements.",
  },
];