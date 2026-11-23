import {
  LEAD_SOURCES,
  LEAD_STATUSES,
  type LeadInput,
  type LeadSource,
  type LeadStatus,
  type LeadValidationErrors,
} from '../types/lead.ts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED_CHARS_REGEX = /^[+\d()\-\s.]+$/;

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed || trimmed.length > 254) {
    return false;
  }
  return EMAIL_REGEX.test(trimmed);
}

export function isValidPhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed || trimmed.length < 7 || trimmed.length > 24) {
    return false;
  }
  if (!PHONE_ALLOWED_CHARS_REGEX.test(trimmed)) {
    return false;
  }
  const digitCount = trimmed.replace(/\D/g, '').length;
  return digitCount >= 7 && digitCount <= 15;
}

export function isValidLeadSource(value: unknown): value is LeadSource {
  return typeof value === 'string' && (LEAD_SOURCES as readonly string[]).includes(value);
}

export function isValidLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && (LEAD_STATUSES as readonly string[]).includes(value);
}

export function validateLeadInput(raw: unknown): {
  valid: boolean;
  errors: LeadValidationErrors;
  sanitized: LeadInput;
} {
  const errors: LeadValidationErrors = {};
  const payload =
    raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
  const company = typeof payload.company === 'string' ? payload.company.trim() : '';
  const source = typeof payload.source === 'string' ? payload.source.trim() : '';
  const status = typeof payload.status === 'string' ? payload.status.trim() : '';

  if (!name) {
    errors.name = 'Full name is required.';
  } else if (name.length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  } else if (name.length > 120) {
    errors.name = 'Full name cannot exceed 120 characters.';
  }

  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address (e.g. alex@company.com).';
  }

  if (!phone) {
    errors.phone = 'Phone number is required.';
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Enter a valid phone number (7–15 digits, e.g. +1 (555) 234-5678).';
  }

  if (!company) {
    errors.company = 'Company name is required.';
  } else if (company.length > 120) {
    errors.company = 'Company name cannot exceed 120 characters.';
  }

  if (!source) {
    errors.source = 'Lead source is required.';
  } else if (!isValidLeadSource(source)) {
    errors.source = `Source must be one of: ${LEAD_SOURCES.join(', ')}.`;
  }

  if (!status) {
    errors.status = 'Lead status is required.';
  } else if (!isValidLeadStatus(status)) {
    errors.status = `Status must be one of: ${LEAD_STATUSES.join(', ')}.`;
  }

  const sanitized: LeadInput = {
    name,
    email: email.toLowerCase(),
    phone,
    company,
    source: isValidLeadSource(source) ? source : 'Website',
    status: isValidLeadStatus(status) ? status : 'New',
  };

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

export function formatLeadDate(isoOrSqliteDate: string): string {
  if (!isoOrSqliteDate) {
    return '—';
  }
  const normalized = isoOrSqliteDate.includes('T')
    ? isoOrSqliteDate
    : `${isoOrSqliteDate.replace(' ', 'T')}Z`;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return isoOrSqliteDate;
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

export function calculateStatusPercentage(count: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.round((count / total) * 100);
}
