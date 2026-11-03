"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SessionProvider } from "@/lib/session";
import { Sidebar, isLivePath } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Notice } from "./ui";

/**
 * The shell owns scrolling: the viewport never scrolls, only <main> does.
 * Pages that are not wired to the backend yet say so, instead of passing mock data off as real.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // The sign-in screen renders without the console chrome (and without a session).
  if (pathname === "/login") return <>{children}</>;

  return (
    <SessionProvider>
      <div className="flex h-screen min-w-[1200px] overflow-hidden">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1400px] px-8 py-8">
              {!isLivePath(pathname) && (
                <div className="mb-6">
                  <Notice tone="warn">
                    <strong>Sample data.</strong> This section is not connected to the backend yet: nothing you see or do here is real.
                  </Notice>
                </div>
              )}
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
