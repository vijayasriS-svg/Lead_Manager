import type { DashboardSummary, Lead, LeadStatus } from '../types/lead.ts';
import { LeadsToolbar } from '../components/LeadsToolbar.tsx';
import { LeadsTable } from '../components/LeadsTable.tsx';

interface LeadsPageProps {
  summary: DashboardSummary | null;
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

export function LeadsPage({
  summary,
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
}: LeadsPageProps) {
  const hasActiveFilters = search.trim().length > 0 || statusFilter !== '';

  return (
    <section
      aria-label="Leads directory"
      className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden"
    >
      <div className="px-5 pt-5 pb-1">
        <h2 className="text-base font-semibold text-slate-900">
          {statusFilter ? `${statusFilter} Pipeline Leads` : 'Complete Lead Directory'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage all potential customer records stored in SQLite.
        </p>
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
  );
}
