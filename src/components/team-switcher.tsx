"use client";

import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

/** Sidebar header: brand link + collapse/expand button. */
export function TeamSwitcher() {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-[#E8E8EF] px-4 py-3 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:px-0 dark:border-slate-800">
      <Link href="/" className="flex min-w-0 items-center gap-2.5" title="TaskFlow home">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-500">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <rect x="1" y="1" width="4" height="12" rx="1" fill="white" />
            <rect x="7" y="1" width="6" height="8" rx="1" fill="white" opacity=".8" />
          </svg>
        </span>
        <span className="truncate text-2xl font-bold text-brand-500 group-data-[collapsible=icon]:hidden">
          TaskFlow
        </span>
      </Link>
      <SidebarTrigger
        className="shrink-0 text-slate-500 hover:text-brand-500"
        aria-label="Collapse or expand sidebar"
        title="Collapse / expand sidebar (Ctrl+B)"
      />
    </div>
  );
}
