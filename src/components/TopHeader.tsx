import { Menu, Plus } from 'lucide-react';
import type { LeadStatus } from '../types/lead.ts';
import type { ActivePage } from './Sidebar.tsx';

interface TopHeaderProps {
  activePage: ActivePage;
  activeStatusFilter: LeadStatus | '';
  onOpenMobileMenu: () => void;
  onAddLead: () => void;
}

export function TopHeader({
  activePage,
  activeStatusFilter,
  onOpenMobileMenu,
  onAddLead,
}: TopHeaderProps) {
  const title =
    activePage === 'dashboard'
      ? 'Sales Dashboard'
      : activeStatusFilter
        ? `${activeStatusFilter} Leads`
        : 'All Leads';

  const breadcrumb =
    activePage === 'dashboard'
      ? 'Workspace / Dashboard'
      : activeStatusFilter
        ? `Workspace / Leads / ${activeStatusFilter}`
        : 'Workspace / Leads';

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="min-w-0">
          <p className="text-xs text-slate-500 truncate hidden sm:block">
            {breadcrumb}
          </p>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight truncate">
            {title}
          </h1>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddLead}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium shadow-xs transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Add Lead</span>
      </button>
    </header>
  );
}
