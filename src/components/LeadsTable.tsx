import { AlertCircle, Pencil, Plus, RotateCcw, Trash2, Users } from 'lucide-react';
import type { Lead } from '../types/lead.ts';
import { formatLeadDate } from '../utils/validation.ts';
import { StatusBadge } from './StatusBadge.tsx';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  hasActiveFilters: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onAddLead: () => void;
  onClearFilters: () => void;
  onRetry: () => void;
}

export function LeadsTable({
  leads,
  loading,
  error,
  hasActiveFilters,
  onEdit,
  onDelete,
  onAddLead,
  onClearFilters,
  onRetry,
}: LeadsTableProps) {
  if (error) {
    return (
      <div className="p-10 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <AlertCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          Unable to load leads
        </h3>
        <p className="text-sm text-slate-600 mb-5 max-w-md mx-auto">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (loading && leads.length === 0) {
    return (
      <div className="p-5 space-y-3" aria-busy="true" aria-label="Loading leads">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-12 rounded-lg bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!loading && leads.length === 0) {
    return (
      <div className="px-6 py-14 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Users className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          {hasActiveFilters ? 'No leads match your filters' : 'No leads added yet'}
        </h3>
        <p className="text-sm text-slate-600 mb-5 max-w-sm mx-auto">
          {hasActiveFilters
            ? 'Try adjusting your name search or switching the status filter to view more records.'
            : 'Add your first potential customer record to start managing your sales pipeline.'}
        </p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium transition-colors"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Clear Filters</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onAddLead}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add First Lead</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={loading ? 'opacity-60 transition-opacity' : ''}>
      {/* Desktop & tablet responsive table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-500">
              <th scope="col" className="py-3 pl-4 pr-2 whitespace-nowrap">
                ID
              </th>
              <th scope="col" className="py-3 px-2.5 whitespace-nowrap">
                Name
              </th>
              <th scope="col" className="py-3 px-2.5 whitespace-nowrap">
                Email
              </th>
              <th scope="col" className="py-3 px-2.5 whitespace-nowrap">
                Phone
              </th>
              <th scope="col" className="py-3 px-2.5 whitespace-nowrap">
                Company
              </th>
              <th scope="col" className="py-3 px-2.5 whitespace-nowrap">
                Source
              </th>
              <th scope="col" className="py-3 px-2.5 whitespace-nowrap">
                Status
              </th>
              <th scope="col" className="py-3 px-2.5 whitespace-nowrap">
                Created Date
              </th>
              <th scope="col" className="py-3 pl-2 pr-4 text-right whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 text-[13px]">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-slate-50/90 transition-colors"
              >
                <td className="py-3 pl-4 pr-2 font-mono text-xs tabular-nums text-slate-500 whitespace-nowrap">
                  #{lead.id}
                </td>
                <td
                  title={lead.name}
                  className="py-3 px-2.5 font-medium text-slate-900 max-w-[140px] truncate"
                >
                  {lead.name}
                </td>
                <td
                  title={lead.email}
                  className="py-3 px-2.5 text-slate-600 max-w-[185px] truncate"
                >
                  <a
                    href={`mailto:${lead.email}`}
                    className="hover:text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                  >
                    {lead.email}
                  </a>
                </td>
                <td className="py-3 px-2.5 font-mono text-xs tabular-nums text-slate-600 whitespace-nowrap">
                  {lead.phone}
                </td>
                <td
                  title={lead.company}
                  className="py-3 px-2.5 text-slate-700 max-w-[155px] truncate"
                >
                  {lead.company}
                </td>
                <td className="py-3 px-2.5 text-slate-600 whitespace-nowrap">
                  {lead.source}
                </td>
                <td className="py-3 px-2.5 whitespace-nowrap">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="py-3 px-2.5 font-mono text-xs tabular-nums text-slate-500 whitespace-nowrap">
                  {formatLeadDate(lead.created_at)}
                </td>
                <td className="py-3 pl-2 pr-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(lead)}
                      aria-label={`Edit ${lead.name}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <Pencil className="h-3 w-3" aria-hidden="true" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(lead)}
                      aria-label={`Delete ${lead.name}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-rose-700 bg-white border border-slate-200 hover:border-rose-300 hover:bg-rose-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked list view for zero horizontal overflow on 390px viewports */}
      <div className="md:hidden divide-y divide-slate-200">
        {leads.map((lead) => (
          <article key={lead.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                  <span className="font-mono tabular-nums">#{lead.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lead.source}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {formatLeadDate(lead.created_at)}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {lead.name}
                </h3>
                <p className="text-xs text-slate-600 truncate">{lead.company}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <p className="truncate">{lead.email}</p>
              <p className="font-mono tabular-nums">{lead.phone}</p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onEdit(lead)}
                aria-label={`Edit ${lead.name}`}
                className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(lead)}
                aria-label={`Delete ${lead.name}`}
                className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/40 text-xs font-medium text-rose-700 hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Delete</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
