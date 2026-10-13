import Sidebar from "../Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-950">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Operations Console
            </p>
            <p className="text-xs text-slate-500">
              Loan administration and monitoring
            </p>
          </div>

          <div className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600">
            Demo Mode
          </div>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}