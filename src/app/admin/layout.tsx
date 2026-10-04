import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Admin & Counsellor Hub - CareerSaathi",
  description: "Counsellor lead management and live telemetry dashboard.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Admin Top Banner / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
            ADM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white block leading-none">
                CareerSaathi Hub
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Staff & Counsellor
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block font-medium">
              Dialect-Matched Family Escalation & Telemetry
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/my-path"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Learner View</span>
          </Link>

          <form action={signOutAction}>
            <button
              type="submit"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-900/50 bg-red-950/40 hover:bg-red-900/60 text-red-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}

