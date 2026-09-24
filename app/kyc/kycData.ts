export type KycStatus =
  | "Manual Review"
  | "Pending Provider"
  | "Verified";

export type KycRecord = {
  kycId: string;
  customerId: string;
  customerName: string;
  document: string;
  documentNumber: string;
  provider: string;
  status: KycStatus;
  flag: string;
  submitted: string;
  verificationAttempts: number;
};

export const kycRecords: KycRecord[] = [
  {
    kycId: "KYC-1001",
    customerId: "CUST-1001",
    customerName: "Rahul Sharma",
    document: "Aadhaar",
    documentNumber: "XXXX XXXX 4521",
    provider: "DigiLocker",
    status: "Manual Review",
    flag: "Name mismatch",
    submitted: "24 Sep 2026, 09:42 AM",
    verificationAttempts: 2,
  },
  {
    kycId: "KYC-1002",
    customerId: "CUST-1002",
    customerName: "Priya Singh",
    document: "PAN",
    documentNumber: "XXXXX1234X",
    provider: "External KYC Provider",
    status: "Manual Review",
    flag: "Document unclear",
    submitted: "24 Sep 2026, 10:15 AM",
    verificationAttempts: 1,
  },
  {
    kycId: "KYC-1003",
    customerId: "CUST-1003",
    customerName: "Amit Kumar",
    document: "Aadhaar",
    documentNumber: "XXXX XXXX 7824",
    provider: "DigiLocker",
    status: "Pending Provider",
    flag: "Awaiting verification",
    submitted: "24 Sep 2026, 11:08 AM",
    verificationAttempts: 1,
  },
  {
    kycId: "KYC-1004",
    customerId: "CUST-1004",
    customerName: "Neha Verma",
    document: "PAN",
    documentNumber: "XXXXX5678P",
    provider: "External KYC Provider",
    status: "Manual Review",
    flag: "DOB mismatch",
    submitted: "24 Sep 2026, 11:37 AM",
    verificationAttempts: 2,
  },
];