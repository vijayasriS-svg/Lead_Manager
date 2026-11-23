import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ChevronDown, Loader2, X } from 'lucide-react';
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type Lead,
  type LeadInput,
  type LeadSource,
  type LeadStatus,
  type LeadValidationErrors,
} from '../types/lead.ts';
import { validateLeadInput } from '../utils/validation.ts';
import { ApiClientError } from '../services/api.ts';

interface LeadModalProps {
  open: boolean;
  editingLead: Lead | null;
  onClose: () => void;
  onSubmit: (data: LeadInput, leadId?: number) => Promise<void>;
}

const EMPTY_FORM: LeadInput = {
  name: '',
  email: '',
  phone: '',
  company: '',
  source: 'Website',
  status: 'New',
};

export function LeadModal({
  open,
  editingLead,
  onClose,
  onSubmit,
}: LeadModalProps) {
  const [formData, setFormData] = useState<LeadInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<LeadValidationErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingLead) {
      setFormData({
        name: editingLead.name,
        email: editingLead.email,
        phone: editingLead.phone,
        company: editingLead.company,
        source: editingLead.source,
        status: editingLead.status,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setErrors({});
    setFormError(null);
    setSubmitting(false);

    const timer = window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 20);

    return () => window.clearTimeout(timer);
  }, [open, editingLead]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, submitting, onClose]);

  if (!open) {
    return null;
  }

  const isEditMode = Boolean(editingLead);

  const handleFieldChange = <K extends keyof LeadInput>(
    field: K,
    value: LeadInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (formError) {
      setFormError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateLeadInput(formData);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      await onSubmit(result.sanitized, editingLead?.id);
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.fieldErrors) {
          setErrors(err.fieldErrors);
        }
        setFormError(err.message);
      } else {
        setFormError('Could not save lead. Please try again.');
      }
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={() => {
          if (!submitting) {
            onClose();
          }
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2
              id="lead-modal-title"
              className="text-base font-semibold text-slate-900"
            >
              {isEditMode ? `Edit Lead #${editingLead?.id}` : 'Add New Lead'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? 'Update customer details and pipeline stage.'
                : 'Enter potential customer details to save to the CRM.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close lead form"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700"
            >
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="lead-name"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="lead-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'lead-name-error' : undefined}
                placeholder="e.g. Jordan Patel"
                className={`w-full h-10 px-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.name
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/15'
                }`}
              />
              {errors.name && (
                <p id="lead-name-error" className="mt-1 text-xs text-rose-600">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lead-email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email <span className="text-rose-600">*</span>
              </label>
              <input
                id="lead-email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'lead-email-error' : undefined}
                placeholder="jordan@company.com"
                className={`w-full h-10 px-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.email
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/15'
                }`}
              />
              {errors.email && (
                <p id="lead-email-error" className="mt-1 text-xs text-rose-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lead-phone"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Phone Number <span className="text-rose-600">*</span>
              </label>
              <input
                id="lead-phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'lead-phone-error' : undefined}
                placeholder="+1 (555) 234-5678"
                className={`w-full h-10 px-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.phone
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/15'
                }`}
              />
              {errors.phone && (
                <p id="lead-phone-error" className="mt-1 text-xs text-rose-600">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="lead-company"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Company Name <span className="text-rose-600">*</span>
              </label>
              <input
                id="lead-company"
                name="company"
                type="text"
                required
                value={formData.company}
                onChange={(e) => handleFieldChange('company', e.target.value)}
                aria-invalid={Boolean(errors.company)}
                aria-describedby={
                  errors.company ? 'lead-company-error' : undefined
                }
                placeholder="e.g. Acme Industrial Corp"
                className={`w-full h-10 px-3 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.company
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15'
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/15'
                }`}
              />
              {errors.company && (
                <p id="lead-company-error" className="mt-1 text-xs text-rose-600">
                  {errors.company}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lead-source"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Source <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <select
                  id="lead-source"
                  name="source"
                  value={formData.source}
                  onChange={(e) =>
                    handleFieldChange('source', e.target.value as LeadSource)
                  }
                  aria-invalid={Boolean(errors.source)}
                  className="appearance-none w-full h-10 pl-3 pr-9 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-colors"
                >
                  {LEAD_SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
              </div>
              {errors.source && (
                <p className="mt-1 text-xs text-rose-600">{errors.source}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lead-status"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Status <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <select
                  id="lead-status"
                  name="status"
                  value={formData.status}
                  onChange={(e) =>
                    handleFieldChange('status', e.target.value as LeadStatus)
                  }
                  aria-invalid={Boolean(errors.status)}
                  className="appearance-none w-full h-10 pl-3 pr-9 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-colors"
                >
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
              {errors.status && (
                <p className="mt-1 text-xs text-rose-600">{errors.status}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium shadow-xs disabled:opacity-60 transition-colors whitespace-nowrap"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              <span>
                {submitting
                  ? 'Saving...'
                  : isEditMode
                    ? 'Save Changes'
                    : 'Create Lead'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
