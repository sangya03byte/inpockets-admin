export type CollectionStatus =
  | "Overdue"
  | "Promise to Pay"
  | "Contacted"
  | "Escalated"
  | "Resolved";

export type CollectionState =
  | "OVERDUE"
  | "PROMISE_TO_PAY"
  | "CONTACTED"
  | "ESCALATED"
  | "RESOLVED";

export type CollectionPriority = "Low" | "Medium" | "High";

export type CollectionRecord = {
  accountId: string;
  customerId: string;
  customerName: string;
  loanId: string;
  overdueAmount: number;
  daysOverdue: number;
  dueDate: string;
  status: CollectionStatus;
  state: CollectionState;
  priority: CollectionPriority;
  assignedTo: string;
  lastContacted: string;
  contactOutcome: string;
  nextAction: string;
};

export const collectionRecords: CollectionRecord[] = [
  {
    accountId: "ACC-1001",
    customerId: "CUS-1001",
    customerName: "Aarav Sharma",
    loanId: "LOAN-1001",
    overdueAmount: 18500,
    daysOverdue: 12,
    dueDate: "13 Sep 2026",
    status: "Overdue",
    state: "OVERDUE",
    priority: "High",
    assignedTo: "Collections Agent 01",
    lastContacted: "24 Sep 2026, 11:30 AM",
    contactOutcome: "Customer requested additional time for repayment.",
    nextAction: "Follow up on promised repayment date.",
  },
  {
    accountId: "ACC-1002",
    customerId: "CUS-1002",
    customerName: "Priya Verma",
    loanId: "LOAN-1002",
    overdueAmount: 9200,
    daysOverdue: 7,
    dueDate: "18 Sep 2026",
    status: "Promise to Pay",
    state: "PROMISE_TO_PAY",
    priority: "Medium",
    assignedTo: "Collections Agent 02",
    lastContacted: "24 Sep 2026, 03:15 PM",
    contactOutcome: "Customer promised repayment within two days.",
    nextAction: "Verify repayment against promise date.",
  },
  {
    accountId: "ACC-1003",
    customerId: "CUS-1003",
    customerName: "Rohan Patel",
    loanId: "LOAN-1003",
    overdueAmount: 14300,
    daysOverdue: 15,
    dueDate: "10 Sep 2026",
    status: "Contacted",
    state: "CONTACTED",
    priority: "High",
    assignedTo: "Collections Agent 01",
    lastContacted: "25 Sep 2026, 09:45 AM",
    contactOutcome: "Customer was successfully contacted.",
    nextAction: "Continue repayment follow-up.",
  },
  {
    accountId: "ACC-1004",
    customerId: "CUS-1004",
    customerName: "Neha Singh",
    loanId: "LOAN-1004",
    overdueAmount: 27500,
    daysOverdue: 24,
    dueDate: "01 Sep 2026",
    status: "Escalated",
    state: "ESCALATED",
    priority: "High",
    assignedTo: "Senior Collections Agent",
    lastContacted: "23 Sep 2026, 01:20 PM",
    contactOutcome: "Multiple repayment follow-ups were unsuccessful.",
    nextAction: "Senior collections review required.",
  },
  {
    accountId: "ACC-1005",
    customerId: "CUS-1005",
    customerName: "Karan Mehta",
    loanId: "LOAN-1005",
    overdueAmount: 6500,
    daysOverdue: 3,
    dueDate: "22 Sep 2026",
    status: "Resolved",
    state: "RESOLVED",
    priority: "Low",
    assignedTo: "Collections Agent 03",
    lastContacted: "24 Sep 2026, 10:10 AM",
    contactOutcome: "Payment received and account regularized.",
    nextAction: "No further action required.",
  },
];