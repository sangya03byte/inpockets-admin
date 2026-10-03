export type LoanLevel = {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  maxTenureMonths: number;
  decisionMode: "AUTO" | "MANUAL_REVIEW";
};

export const loanLevels: LoanLevel[] = [
  {
    id: "LEVEL-1",
    name: "Starter",
    minAmount: 10000,
    maxAmount: 50000,
    maxTenureMonths: 12,
    decisionMode: "AUTO",
  },
  {
    id: "LEVEL-2",
    name: "Standard",
    minAmount: 50001,
    maxAmount: 150000,
    maxTenureMonths: 18,
    decisionMode: "AUTO",
  },
  {
    id: "LEVEL-3",
    name: "Premium",
    minAmount: 150001,
    maxAmount: 300000,
    maxTenureMonths: 24,
    decisionMode: "MANUAL_REVIEW",
  },
  {
    id: "LEVEL-4",
    name: "High Value",
    minAmount: 300001,
    maxAmount: 500000,
    maxTenureMonths: 36,
    decisionMode: "MANUAL_REVIEW",
  },
];