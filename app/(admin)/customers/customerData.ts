export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: "Active" | "Suspended";
  joinedDate: string;
  address: string;
  totalLoans: number;
  outstandingAmount: number;
};

export const customers: Customer[] = [
  {
    id: "CUST-1001",
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    status: "Active",
    joinedDate: "2025-01-12",
    address: "Raipur, Chhattisgarh",
    totalLoans: 2,
    outstandingAmount: 42500,
  },
  {
    id: "CUST-1002",
    name: "Priya Singh",
    phone: "9123456780",
    email: "priya.singh@example.com",
    status: "Active",
    joinedDate: "2025-02-28",
    address: "Bhilai, Chhattisgarh",
    totalLoans: 1,
    outstandingAmount: 18000,
  },
  {
    id: "CUST-1003",
    name: "Amit Kumar",
    phone: "9988776655",
    email: "amit.kumar@example.com",
    status: "Suspended",
    joinedDate: "2025-03-07",
    address: "Durg, Chhattisgarh",
    totalLoans: 3,
    outstandingAmount: 76200,
  },
  {
    id: "CUST-1004",
    name: "Neha Verma",
    phone: "9012345678",
    email: "neha.verma@example.com",
    status: "Active",
    joinedDate: "2025-04-19",
    address: "Korba, Chhattisgarh",
    totalLoans: 1,
    outstandingAmount: 25000,
  },
];