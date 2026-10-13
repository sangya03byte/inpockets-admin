export type SupportStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Escalated";

export type SupportState =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "ESCALATED";

export type SupportPriority = "Low" | "Medium" | "High";

export type SupportRecord = {
  ticketId: string;
  customerId: string;
  customerName: string;
  category: string;
  subject: string;
  description: string;
  status: SupportStatus;
  state: SupportState;
  priority: SupportPriority;
  createdAt: string;
  assignedTo: string;
  lastUpdated: string;
};

export const supportRecords: SupportRecord[] = [
  {
    ticketId: "TKT-1001",
    customerId: "CUS-1001",
    customerName: "Aarav Sharma",
    category: "Loan Repayment",
    subject: "Payment not reflected",
    description:
      "Customer reports that a recent loan repayment is not visible in the account.",
    status: "Open",
    state: "OPEN",
    priority: "High",
    createdAt: "25 Sep 2026, 09:15 AM",
    assignedTo: "Unassigned",
    lastUpdated: "25 Sep 2026, 09:15 AM",
  },
  {
    ticketId: "TKT-1002",
    customerId: "CUS-1002",
    customerName: "Priya Verma",
    category: "KYC",
    subject: "KYC verification pending",
    description:
      "Customer is asking why the KYC verification process is taking longer than expected.",
    status: "In Progress",
    state: "IN_PROGRESS",
    priority: "Medium",
    createdAt: "24 Sep 2026, 02:40 PM",
    assignedTo: "Support Agent 01",
    lastUpdated: "25 Sep 2026, 10:05 AM",
  },
  {
    ticketId: "TKT-1003",
    customerId: "CUS-1003",
    customerName: "Rohan Patel",
    category: "Loan Application",
    subject: "Application status enquiry",
    description:
      "Customer wants an update on the current status of their loan application.",
    status: "Open",
    state: "OPEN",
    priority: "Low",
    createdAt: "24 Sep 2026, 11:20 AM",
    assignedTo: "Unassigned",
    lastUpdated: "24 Sep 2026, 11:20 AM",
  },
  {
    ticketId: "TKT-1004",
    customerId: "CUS-1004",
    customerName: "Neha Singh",
    category: "Account",
    subject: "Update registered mobile number",
    description:
      "Customer requested assistance with updating the mobile number associated with the account.",
    status: "Resolved",
    state: "RESOLVED",
    priority: "Medium",
    createdAt: "23 Sep 2026, 01:30 PM",
    assignedTo: "Support Agent 02",
    lastUpdated: "24 Sep 2026, 04:10 PM",
  },
  {
    ticketId: "TKT-1005",
    customerId: "CUS-1005",
    customerName: "Karan Mehta",
    category: "Complaint",
    subject: "Unexpected repayment charge",
    description:
      "Customer has raised a complaint regarding an unexpected charge associated with a repayment.",
    status: "Escalated",
    state: "ESCALATED",
    priority: "High",
    createdAt: "22 Sep 2026, 03:45 PM",
    assignedTo: "Senior Support Agent",
    lastUpdated: "23 Sep 2026, 09:25 AM",
  },
];