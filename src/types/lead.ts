export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Social Media',
  'Advertisement',
  'Cold Call',
  'Other',
] as const;

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Lost',
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  created_at: string;
}

export interface LeadInput {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
}

export type LeadValidationErrors = Partial<Record<keyof LeadInput, string>>;

export interface StatusCounts {
  New: number;
  Contacted: number;
  Qualified: number;
  Lost: number;
}

export interface DashboardSummary {
  total: number;
  counts: StatusCounts;
  bySource: Record<LeadSource, number>;
  recentLeads: Lead[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
  count?: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: LeadValidationErrors;
}
