export type Payment = {
  id: string;
  loanId: string;
  customer: string;
  amount: number;
  status: "PENDING" | "SUCCESSFUL" | "FAILED";
  paymentDate: string;
};

export const payments: Payment[] = [
  {
    id: "PAY-1001",
    loanId: "LN-1001",
    customer: "Aarav Sharma",
    amount: 12500,
    status: "SUCCESSFUL",
    paymentDate: "2026-09-28",
  },
  {
    id: "PAY-1002",
    loanId: "LN-1002",
    customer: "Priya Mehta",
    amount: 8500,
    status: "FAILED",
    paymentDate: "2026-09-27",
  },
  {
    id: "PAY-1003",
    loanId: "LN-1003",
    customer: "Rohan Verma",
    amount: 15000,
    status: "PENDING",
    paymentDate: "2026-09-29",
  },
  {
    id: "PAY-1004",
    loanId: "LN-1004",
    customer: "Neha Singh",
    amount: 7200,
    status: "SUCCESSFUL",
    paymentDate: "2026-09-25",
  },
  {
    id: "PAY-1005",
    loanId: "LN-1005",
    customer: "Vikram Rao",
    amount: 10000,
    status: "FAILED",
    paymentDate: "2026-09-22",
  },
];