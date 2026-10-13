export type Disbursement = {
  id: string;
  loanId: string;
  customer: string;
  amount: number;
  status:
    | "PENDING"
    | "PROCESSING"
    | "SUCCESS"
    | "FAILED"
    | "REQUIRES_REVIEW";
  createdAt: string;
};

export const disbursements: Disbursement[] = [
  {
    id: "DSB-1001",
    loanId: "LN-1001",
    customer: "Aarav Sharma",
    amount: 250000,
    status: "SUCCESS",
    createdAt: "2026-09-30 09:15",
  },
  {
    id: "DSB-1002",
    loanId: "LN-1002",
    customer: "Priya Mehta",
    amount: 180000,
    status: "PROCESSING",
    createdAt: "2026-09-30 10:42",
  },
  {
    id: "DSB-1003",
    loanId: "LN-1003",
    customer: "Rohan Verma",
    amount: 320000,
    status: "REQUIRES_REVIEW",
    createdAt: "2026-09-30 11:08",
  },
  {
    id: "DSB-1004",
    loanId: "LN-1004",
    customer: "Neha Singh",
    amount: 150000,
    status: "PENDING",
    createdAt: "2026-09-30 12:21",
  },
  {
    id: "DSB-1005",
    loanId: "LN-1005",
    customer: "Vikram Rao",
    amount: 200000,
    status: "FAILED",
    createdAt: "2026-09-29 16:37",
  },
];