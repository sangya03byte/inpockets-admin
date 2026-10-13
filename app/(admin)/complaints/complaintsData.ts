export type Complaint = {
  id: string;
  customer: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED";
  escalationLevel: "LEVEL_1" | "LEVEL_2" | "LEVEL_3";
  assignedTo: string;
  createdAt: string;
};

export const complaints: Complaint[] = [
  {
    id: "CMP-1001",
    customer: "Aarav Sharma",
    subject: "Payment not reflected in account",
    category: "Payment",
    priority: "HIGH",
    status: "OPEN",
    escalationLevel: "LEVEL_1",
    assignedTo: "Customer Support",
    createdAt: "2026-09-29",
  },
  {
    id: "CMP-1002",
    customer: "Priya Mehta",
    subject: "Unable to complete KYC verification",
    category: "KYC",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    escalationLevel: "LEVEL_1",
    assignedTo: "KYC Reviewer",
    createdAt: "2026-09-27",
  },
  {
    id: "CMP-1003",
    customer: "Rohan Verma",
    subject: "Disbursement delay",
    category: "Disbursement",
    priority: "HIGH",
    status: "ESCALATED",
    escalationLevel: "LEVEL_2",
    assignedTo: "Finance",
    createdAt: "2026-09-25",
  },
  {
    id: "CMP-1004",
    customer: "Neha Singh",
    subject: "Incorrect collection reminder",
    category: "Collections",
    priority: "LOW",
    status: "RESOLVED",
    escalationLevel: "LEVEL_1",
    assignedTo: "Collections Agent",
    createdAt: "2026-09-22",
  },
  {
    id: "CMP-1005",
    customer: "Vikram Rao",
    subject: "Loan account closure request",
    category: "Loan",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    escalationLevel: "LEVEL_2",
    assignedTo: "Customer Support",
    createdAt: "2026-09-20",
  },
];
