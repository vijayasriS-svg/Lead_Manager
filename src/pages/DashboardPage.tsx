import {
  LEAD_SOURCES,
  type DashboardSummary,
  type Lead,
  type LeadStatus,
} from '../types/lead.ts';
import { DashboardSummaryCards } from '../components/DashboardSummary.tsx';
import { LeadsToolbar } from '../components/LeadsToolbar.tsx';
import { LeadsTable } from '../components/LeadsTable.tsx';

interface DashboardPageProps {
  summary: DashboardSummary | null;
  summaryLoading: boolean;
  leads: Lead[];
  leadsLoading: boolean;
  leadsError: string | null;
  search: string;
  statusFilter: LeadStatus | '';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: LeadStatus | '') => void;
  onClearFilters: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
  onAddLead: () => void;
  onRetry: () => void;
}

export function DashboardPage({
  summary,
  summaryLoading,
  leads,
  leadsLoading,
  leadsError,
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onClearFilters,
  onEditLead,
  onDeleteLead,
  onAddLead,
  onRetry,
}: DashboardPageProps) {
  const hasActiveFilters = search.trim().length > 0 || statusFilter !== '';

  return (
    <div className="space-y-6">
      <DashboardSummaryCards
        summary={summary}
        loading={summaryLoading}
        activeStatusFilter={statusFilter}
        onSelectStatus={onStatusChange}
      />

      {summary && summary.total > 0 && (
        <section
          aria-label="Lead acquisition sources"
          className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-2xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Acquisition Channels
            </h2>
            <p className="text-xs text-slate-500">
              Distribution of all recorded leads by source
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-2.5">
            {LEAD_SOURCES.map((source) => {
              const count = summary.bySource[source] ?? 0;
              return (
                <div
                  key={source}
                  className="flex items-baseline justify-between gap-2 border-b border-slate-100 pb-1.5"
                >
                  <span className="text-xs text-slate-600 truncate">
                    {source}
                  </span>
                  <span className="font-mono text-sm font-medium tabular-nums text-slate-900">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section
        aria-label="Leads directory"
        className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden"
      >
        <div className="px-5 pt-5 pb-1 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Lead Records
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Search by customer name, filter by pipeline status, or update existing contacts.
            </p>
          </div>
        </div>

        <LeadsToolbar
          search={search}
          statusFilter={statusFilter}
          resultCount={leads.length}
          totalCount={summary?.total ?? null}
          onSearchChange={onSearchChange}
          onStatusChange={onStatusChange}
          onClearFilters={onClearFilters}
        />

        <LeadsTable
          leads={leads}
          loading={leadsLoading}
          error={leadsError}
          hasActiveFilters={hasActiveFilters}
          onEdit={onEditLead}
          onDelete={onDeleteLead}
          onAddLead={onAddLead}
          onClearFilters={onClearFilters}
          onRetry={onRetry}
        />
      </section>
    </div>
  );
}
