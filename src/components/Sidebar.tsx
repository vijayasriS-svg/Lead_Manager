import { LayoutDashboard, Users, X } from 'lucide-react';
import { LEAD_STATUSES, type DashboardSummary, type LeadStatus } from '../types/lead.ts';

export type ActivePage = 'dashboard' | 'leads';

interface SidebarProps {
  activePage: ActivePage;
  activeStatusFilter: LeadStatus | '';
  summary: DashboardSummary | null;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onNavigateDashboard: () => void;
  onNavigateAllLeads: () => void;
  onSelectStatusView: (status: LeadStatus) => void;
}

export function Sidebar({
  activePage,
  activeStatusFilter,
  summary,
  mobileOpen,
  onCloseMobile,
  onNavigateDashboard,
  onNavigateAllLeads,
  onSelectStatusView,
}: SidebarProps) {
  const navContent = (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            onNavigateDashboard();
            onCloseMobile();
          }}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <polyline points="16 11 18 13 22 9" />
            </svg>
          </span>
          <span className="font-display text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            Lead Manager
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => {
              onNavigateDashboard();
              onCloseMobile();
            }}
            aria-current={activePage === 'dashboard' && !activeStatusFilter ? 'page' : undefined}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              activePage === 'dashboard' && !activeStatusFilter
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Dashboard</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigateAllLeads();
              onCloseMobile();
            }}
            aria-current={activePage === 'leads' && !activeStatusFilter ? 'page' : undefined}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              activePage === 'leads' && !activeStatusFilter
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>All Leads</span>
            </span>
            <span className="font-mono text-xs tabular-nums text-slate-500">
              {summary ? summary.total : '—'}
            </span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <p className="px-3 mb-2 text-xs font-medium text-slate-500">
            Pipeline Stages
          </p>
          <div className="space-y-1">
            {LEAD_STATUSES.map((status) => {
              const isSelected = activeStatusFilter === status;
              const count = summary ? summary.counts[status] : null;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    onSelectStatusView(status);
                    onCloseMobile();
                  }}
                  aria-current={isSelected ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{status}</span>
                  <span className="font-mono text-xs tabular-nums text-slate-500">
                    {count !== null ? count : '—'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block lg:w-56 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen">
        {navContent}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-64 max-w-[82vw] h-full shadow-xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
