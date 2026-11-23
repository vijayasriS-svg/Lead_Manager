import type { DashboardSummary, LeadStatus } from '../types/lead.ts';
import { calculateStatusPercentage } from '../utils/validation.ts';

interface DashboardSummaryProps {
  summary: DashboardSummary | null;
  loading: boolean;
  activeStatusFilter: LeadStatus | '';
  onSelectStatus: (status: LeadStatus | '') => void;
}

interface MetricCardConfig {
  key: 'Total' | LeadStatus;
  label: string;
  filterValue: LeadStatus | '';
  barClass: string;
  labelAccentClass: string;
}

const METRIC_CARDS: MetricCardConfig[] = [
  {
    key: 'Total',
    label: 'Total Leads',
    filterValue: '',
    barClass: 'bg-slate-900',
    labelAccentClass: 'text-slate-600',
  },
  {
    key: 'New',
    label: 'New',
    filterValue: 'New',
    barClass: 'bg-blue-600',
    labelAccentClass: 'text-blue-700',
  },
  {
    key: 'Contacted',
    label: 'Contacted',
    filterValue: 'Contacted',
    barClass: 'bg-amber-500',
    labelAccentClass: 'text-amber-700',
  },
  {
    key: 'Qualified',
    label: 'Qualified',
    filterValue: 'Qualified',
    barClass: 'bg-emerald-600',
    labelAccentClass: 'text-emerald-700',
  },
  {
    key: 'Lost',
    label: 'Lost',
    filterValue: 'Lost',
    barClass: 'bg-rose-500',
    labelAccentClass: 'text-rose-700',
  },
];

export function DashboardSummaryCards({
  summary,
  loading,
  activeStatusFilter,
  onSelectStatus,
}: DashboardSummaryProps) {
  if (loading && !summary) {
    return (
      <section aria-label="Lead summary statistics" className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {METRIC_CARDS.map((card) => (
          <div
            key={card.key}
            className={`bg-white border border-slate-200 rounded-xl p-5 shadow-2xs animate-pulse ${
              card.key === 'Total' ? 'col-span-2 xl:col-span-1' : ''
            }`}
          >
            <div className="h-3.5 w-20 bg-slate-200 rounded mb-4" />
            <div className="h-8 w-14 bg-slate-200 rounded mb-4" />
            <div className="h-1.5 w-full bg-slate-100 rounded-full" />
          </div>
        ))}
      </section>
    );
  }

  const total = summary?.total ?? 0;

  return (
    <section aria-label="Lead summary statistics" className="grid grid-cols-2 xl:grid-cols-5 gap-4">
      {METRIC_CARDS.map((card) => {
        const value =
          card.key === 'Total' ? total : (summary?.counts[card.key] ?? 0);
        const percentage =
          card.key === 'Total'
            ? total > 0
              ? 100
              : 0
            : calculateStatusPercentage(value, total);
        const isActive =
          card.key === 'Total'
            ? activeStatusFilter === ''
            : activeStatusFilter === card.filterValue;

        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelectStatus(card.filterValue)}
            aria-pressed={isActive}
            data-testid={`metric-card-${card.key.toLowerCase()}`}
            className={`text-left bg-white rounded-xl p-5 border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              card.key === 'Total' ? 'col-span-2 xl:col-span-1' : ''
            } ${
              isActive
                ? 'border-blue-500 shadow-sm ring-2 ring-blue-600/10'
                : 'border-slate-200 shadow-2xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className={`text-sm font-medium ${card.labelAccentClass}`}>
                {card.label}
              </span>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {card.key === 'Total' ? 'All' : `${percentage}%`}
              </span>
            </div>

            <div className="font-mono text-3xl font-semibold tabular-nums tracking-tight text-slate-900 mb-4">
              {value}
            </div>

            {card.key === 'Total' ? (
              <div
                aria-hidden="true"
                className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden flex"
              >
                {total > 0 && summary && (
                  <>
                    <span
                      className="bg-blue-600 h-full"
                      style={{
                        width: `${calculateStatusPercentage(summary.counts.New, total)}%`,
                      }}
                    />
                    <span
                      className="bg-amber-500 h-full"
                      style={{
                        width: `${calculateStatusPercentage(summary.counts.Contacted, total)}%`,
                      }}
                    />
                    <span
                      className="bg-emerald-600 h-full"
                      style={{
                        width: `${calculateStatusPercentage(summary.counts.Qualified, total)}%`,
                      }}
                    />
                    <span
                      className="bg-rose-500 h-full"
                      style={{
                        width: `${calculateStatusPercentage(summary.counts.Lost, total)}%`,
                      }}
                    />
                  </>
                )}
              </div>
            ) : (
              <div
                aria-hidden="true"
                className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden"
              >
                <div
                  className={`h-full rounded-full transition-all duration-200 ${card.barClass}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            )}
          </button>
        );
      })}
    </section>
  );
}
