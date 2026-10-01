export type Loan = {
  id: string;
  applicationId: string;
  customer: string;
  status: "ACTIVE" | "OVERDUE" | "CLOSED" | "PENDING_DISBURSEMENT";
  disbursedAmount: number;
  outstandingBalance: number;
  nextDueDate: string;
};

export const loans: Loan[] = [
  {
    id: "LN-1001",
    applicationId: "APP-1001",
    customer: "Aarav Sharma",
    status: "ACTIVE",
    disbursedAmount: 250000,
    outstandingBalance: 184500,
    nextDueDate: "2026-10-15",
  },
  {
    id: "LN-1002",
    applicationId: "APP-1002",
    customer: "Priya Mehta",
    status: "OVERDUE",
    disbursedAmount: 180000,
    outstandingBalance: 126400,
    nextDueDate: "2026-09-20",
  },
  {
    id: "LN-1003",
    applicationId: "APP-1003",
    customer: "Rohan Verma",
    status: "ACTIVE",
    disbursedAmount: 320000,
    outstandingBalance: 241800,
    nextDueDate: "2026-10-08",
  },
  {
    id: "LN-1004",
    applicationId: "APP-1004",
    customer: "Neha Singh",
    status: "PENDING_DISBURSEMENT",
    disbursedAmount: 150000,
    outstandingBalance: 0,
    nextDueDate: "2026-10-20",
  },
  {
    id: "LN-1005",
    applicationId: "APP-1005",
    customer: "Vikram Rao",
    status: "CLOSED",
    disbursedAmount: 200000,
    outstandingBalance: 0,
    nextDueDate: "—",
  },
];