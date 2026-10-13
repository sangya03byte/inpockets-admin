"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * The shell owns scrolling: the viewport never scrolls, only <main> does.
 * That removes the nested min-h-screen / double-scrollbar overflow of the old layout.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // The sign-in screen renders without the console chrome.
  if (pathname === "/login") return <>{children}</>;

  return (
    <div className="flex h-screen min-w-[1200px] overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1400px] px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
