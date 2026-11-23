import { ChevronDown, RotateCcw, Search, X } from 'lucide-react';
import { LEAD_STATUSES, type LeadStatus } from '../types/lead.ts';

interface LeadsToolbarProps {
  search: string;
  statusFilter: LeadStatus | '';
  resultCount: number;
  totalCount: number | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: LeadStatus | '') => void;
  onClearFilters: () => void;
}

export function LeadsToolbar({
  search,
  statusFilter,
  resultCount,
  totalCount,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}: LeadsToolbarProps) {
  const hasFilters = search.trim().length > 0 || statusFilter !== '';

  return (
    <div className="p-4 sm:px-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
        <div className="relative flex-1 max-w-md">
          <label htmlFor="lead-search-input" className="sr-only">
            Search leads by name
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="lead-search-input"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads by name..."
            className="w-full h-10 pl-9 pr-9 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-colors"
          />
          {search.length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <label htmlFor="lead-status-filter" className="sr-only">
            Filter leads by status
          </label>
          <div className="relative">
            <select
              id="lead-status-filter"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as LeadStatus | '')}
              className="appearance-none h-10 min-w-[164px] rounded-lg border border-slate-300 bg-white pl-3 pr-9 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-colors"
            >
              <option value="">All Statuses</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex h-10 items-center gap-1.5 px-3 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 font-mono tabular-nums whitespace-nowrap shrink-0">
        {hasFilters && totalCount !== null
          ? `Showing ${resultCount} of ${totalCount} ${totalCount === 1 ? 'lead' : 'leads'}`
          : `${resultCount} ${resultCount === 1 ? 'lead' : 'leads'}`}
      </p>
    </div>
  );
}
