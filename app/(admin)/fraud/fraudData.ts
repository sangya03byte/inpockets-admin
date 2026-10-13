export type FraudCase = {
  id: string;
  applicationId: string;
  customer: string;
  deviceId: string;
  status: "MANUAL_REVIEW" | "ESCALATED" | "CLEARED";
  riskBand: "LOW" | "MEDIUM" | "HIGH";
  signals: string[];
  submittedAt: string;
};

export const fraudCases: FraudCase[] = [
  {
    id: "FRD-1001",
    applicationId: "APP-1001",
    customer: "Aarav Sharma",
    deviceId: "DEV-8821",
    status: "MANUAL_REVIEW",
    riskBand: "HIGH",
    signals: [
      "Multiple applications from the same device",
      "Unusual application velocity",
      "Identity information requires verification",
    ],
    submittedAt: "2026-09-30 09:14",
  },
  {
    id: "FRD-1002",
    applicationId: "APP-1003",
    customer: "Priya Mehta",
    deviceId: "DEV-4472",
    status: "MANUAL_REVIEW",
    riskBand: "MEDIUM",
    signals: [
      "Device previously associated with another account",
      "Bank account ownership requires review",
    ],
    submittedAt: "2026-09-30 08:47",
  },
  {
    id: "FRD-1003",
    applicationId: "APP-1005",
    customer: "Rohan Verma",
    deviceId: "DEV-2198",
    status: "ESCALATED",
    riskBand: "HIGH",
    signals: [
      "Multiple identity attributes require investigation",
      "Application pattern matches a known review scenario",
      "Unusual device activity",
    ],
    submittedAt: "2026-09-29 17:32",
  },
  {
    id: "FRD-1004",
    applicationId: "APP-1007",
    customer: "Neha Singh",
    deviceId: "DEV-7314",
    status: "MANUAL_REVIEW",
    riskBand: "MEDIUM",
    signals: [
      "Recent account creation",
      "Application submitted from a new device",
    ],
    submittedAt: "2026-09-29 15:26",
  },
  {
    id: "FRD-1005",
    applicationId: "APP-1008",
    customer: "Vikram Rao",
    deviceId: "DEV-5630",
    status: "CLEARED",
    riskBand: "LOW",
    signals: [
      "No critical fraud indicators found",
      "Device and identity checks passed",
    ],
    submittedAt: "2026-09-29 12:18",
  },
];