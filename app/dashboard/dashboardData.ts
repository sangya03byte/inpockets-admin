export type DashboardItem = {
  label: string;
  count: number;
  description: string;
  href: string;
};

export const dashboardItems: DashboardItem[] = [
  {
    label: "Applications in Review",
    count: 2,
    description: "Loan applications waiting for underwriting review.",
    href: "/applications",
  },
  {
    label: "KYC Pending",
    count: 2,
    description: "KYC records requiring review or follow-up.",
    href: "/kyc",
  },
  {
    label: "Overdue Collections",
    count: 4,
    description: "Collection accounts currently requiring attention.",
    href: "/collections",
  },
  {
    label: "Open Support Tickets",
    count: 2,
    description: "Support tickets that still need action.",
    href: "/support",
  },
];