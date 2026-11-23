import { CheckCircle2, X, XCircle } from 'lucide-react';

export interface ToastItem {
  id: number;
  type: 'success' | 'error';
  message: string;
}

interface ToastNotificationProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function ToastNotification({
  toasts,
  onDismiss,
}: ToastNotificationProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)]"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        return (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg bg-white ${
              isSuccess
                ? 'border-emerald-200 text-slate-900'
                : 'border-rose-200 text-slate-900'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2
                className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
            ) : (
              <XCircle
                className="h-5 w-5 text-rose-600 shrink-0 mt-0.5"
                aria-hidden="true"
              />
            )}
            <p className="flex-1 text-sm leading-snug text-slate-800">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 shrink-0"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
