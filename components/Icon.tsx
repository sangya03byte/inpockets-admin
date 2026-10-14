import type { SVGProps } from "react";

/* Minimal 24px stroke icon set (no dependency). */
const PATHS: Record<string, string> = {
  dashboard: "M4 13h6V4H4v9Zm0 7h6v-3H4v3Zm10 0h6v-9h-6v9Zm0-16v3h6V4h-6Z",
  users: "M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm9 8v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 5.2a3.5 3.5 0 0 1 0 6.6",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M9 13h6M9 17h6",
  id: "M4 6h16v12H4V6Zm4 4.5a1.5 1.5 0 1 0 0 .01M6 15c.5-1.2 1.4-1.8 2-1.8s1.5.6 2 1.8M13 10h4M13 13h4",
  shield: "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-2.5 9 2 2 3.5-4",
  coins: "M12 8c4 0 7-1.2 7-2.5S16 3 12 3 5 4.2 5 5.5 8 8 12 8Zm7 0v4c0 1.3-3 2.5-7 2.5S5 13.3 5 12V8m14 4v4c0 1.3-3 2.5-7 2.5S5 17.3 5 16v-4m14 4v3c0 1.3-3 2.5-7 2.5S5 20.3 5 19v-3",
  send: "M21 3 3 10.5l7 3 3 7L21 3ZM10 13.5 21 3",
  card: "M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 3h18M7 15h3",
  scale: "M12 4v16M6 20h12M5 7h14M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7Zm14 0-3 7a3.5 3.5 0 0 0 6 0l-3-7Z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z",
  chat: "M4 5h16v11H9l-5 4V5Z",
  alert: "M12 4 2.5 20h19L12 4Zm0 6v4m0 3v.01",
  chart: "M4 20V4m0 16h16M8 16v-5m4 5V8m4 8v-3",
  log: "M6 3h12v18H6V3Zm3 5h6M9 12h6M9 16h4",
  sliders: "M5 5v6m0 4v4m7-14v2m0 4v8m7-14v8m0 4v2M3 11h4M10 9h4m3 6h4",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  key: "M14 10a4 4 0 1 0-3.9 4H12l1.5 1.5H15V17h1.5v1.5H18V16l-3-3-1-3Z",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 3-4.5-4.5",
  chevronRight: "m9 6 6 6-6 6",
  chevronDown: "m6 9 6 6 6-6",
  arrowLeft: "M19 12H5m6-6-6 6 6 6",
  check: "m5 12 5 5 9-10",
  x: "M6 6l12 12M18 6 6 18",
  plus: "M12 5v14M5 12h14",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2",
  external: "M14 4h6v6m0-6-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  logout: "M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4m5-5 5-5-5-5m5 5H9",
  bell: "M6 17V11a6 6 0 1 1 12 0v6l2 2H4l2-2Zm4 4h4",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5V11Z",
  download: "M12 4v11m0 0-4-4m4 4 4-4M5 20h14",
  filter: "M4 5h16l-6 8v6l-4-2v-4L4 5Z",
};

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  size = 18,
  ...rest
}: { name: IconName; size?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
