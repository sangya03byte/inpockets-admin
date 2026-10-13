export type Metric = {
  label: string;
  value: string;
  description: string;
};

export type ChartPoint = {
  label: string;
  value: number;
};

export type ReportTableRow = {
  label: string;
  value: string;
};

export const reportMetrics: Metric[] = [
  {
    label: "Approval Rate",
    value: "68.4%",
    description: "Applications approved during the selected period.",
  },
  {
    label: "Rejection Rate",
    value: "21.7%",
    description: "Applications rejected during the selected period.",
  },
  {
    label: "Disbursement Volume",
    value: "₹18.6L",
    description: "Total disbursed amount during the selected period.",
  },
  {
    label: "Provider Failure Rate",
    value: "3.2%",
    description: "External provider requests that failed.",
  },
];

export const approvalTrend: ChartPoint[] = [
  { label: "Apr", value: 61 },
  { label: "May", value: 64 },
  { label: "Jun", value: 66 },
  { label: "Jul", value: 63 },
  { label: "Aug", value: 70 },
  { label: "Sep", value: 68 },
];

export const dpdBuckets: ChartPoint[] = [
  { label: "0 DPD", value: 42 },
  { label: "1–30", value: 18 },
  { label: "31–60", value: 9 },
  { label: "61–90", value: 5 },
  { label: "90+", value: 3 },
];

export const providerFailures: ChartPoint[] = [
  { label: "KYC Provider", value: 12 },
  { label: "Payment Gateway", value: 8 },
  { label: "Credit Provider", value: 5 },
  { label: "SMS Provider", value: 3 },
];

export const reportTable: ReportTableRow[] = [
  {
    label: "Applications",
    value: "1,248",
  },
  {
    label: "Approved Applications",
    value: "853",
  },
  {
    label: "Rejected Applications",
    value: "271",
  },
  {
    label: "Disbursed Loans",
    value: "642",
  },
  {
    label: "Outstanding Principal",
    value: "₹31.4L",
  },
  {
    label: "Overdue Accounts",
    value: "76",
  },
  {
    label: "KYC Failure Rate",
    value: "4.1%",
  },
  {
    label: "Payment Failure Rate",
    value: "2.8%",
  },
];