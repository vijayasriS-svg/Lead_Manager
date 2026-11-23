import type { LeadStatus } from '../types/lead.ts';

interface StatusBadgeProps {
  status: LeadStatus;
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  New: 'bg-blue-50 text-blue-700 border-blue-200',
  Contacted: 'bg-amber-50 text-amber-800 border-amber-200',
  Qualified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Lost: 'bg-rose-50 text-rose-700 border-rose-200',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
