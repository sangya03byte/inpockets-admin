export type ReconciliationRecord = {
  id: string;
  transactionId: string;
  type: "DISBURSEMENT" | "PAYMENT";
  ourLedgerAmount: number;
  providerAmount: number;
  bankAmount: number;
  status: "MATCHED" | "MISMATCH";
  date: string;
  notes?: string;
};

export const reconciliationRecords: ReconciliationRecord[] = [
  {
    id: "REC-1001",
    transactionId: "DSB-1001",
    type: "DISBURSEMENT",
    ourLedgerAmount: 250000,
    providerAmount: 250000,
    bankAmount: 250000,
    status: "MATCHED",
    date: "2026-09-30",
  },
  {
    id: "REC-1002",
    transactionId: "DSB-1003",
    type: "DISBURSEMENT",
    ourLedgerAmount: 320000,
    providerAmount: 320000,
    bankAmount: 318500,
    status: "MISMATCH",
    date: "2026-09-30",
  },
  {
    id: "REC-1003",
    transactionId: "PAY-1002",
    type: "PAYMENT",
    ourLedgerAmount: 8500,
    providerAmount: 0,
    bankAmount: 0,
    status: "MISMATCH",
    date: "2026-09-27",
  },
  {
    id: "REC-1004",
    transactionId: "PAY-1001",
    type: "PAYMENT",
    ourLedgerAmount: 12500,
    providerAmount: 12500,
    bankAmount: 12500,
    status: "MATCHED",
    date: "2026-09-28",
  },
  {
    id: "REC-1005",
    transactionId: "DSB-1005",
    type: "DISBURSEMENT",
    ourLedgerAmount: 200000,
    providerAmount: 198000,
    bankAmount: 198000,
    status: "MISMATCH",
    date: "2026-09-29",
    notes: "Provider settlement amount differs from ledger amount.",
  },
];