import { useEffect } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import type { Lead } from '../types/lead.ts';

interface DeleteConfirmModalProps {
  lead: Lead | null;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({
  lead,
  deleting,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!lead) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !deleting) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lead, deleting, onCancel]);

  if (!lead) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={() => {
          if (!deleting) {
            onCancel();
          }
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="delete-modal-title"
                className="text-base font-semibold text-slate-900"
              >
                Delete Lead
              </h2>
              <p
                id="delete-modal-description"
                className="mt-1.5 text-sm text-slate-600 leading-relaxed"
              >
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-slate-900">{lead.name}</span>{' '}
                from <span className="font-medium text-slate-800">{lead.company}</span>?
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            aria-label="Close delete confirmation"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium shadow-xs disabled:opacity-60 transition-colors whitespace-nowrap"
          >
            {deleting && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            <span>{deleting ? 'Deleting...' : 'Delete Lead'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
