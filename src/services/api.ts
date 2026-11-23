import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  DashboardSummary,
  Lead,
  LeadInput,
  LeadStatus,
  LeadValidationErrors,
} from '../types/lead.ts';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export class ApiClientError extends Error {
  status: number;
  fieldErrors?: LeadValidationErrors;

  constructor(message: string, status: number, fieldErrors?: LeadValidationErrors) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function parseResponse<T>(response: Response): Promise<ApiSuccessResponse<T>> {
  let body: ApiSuccessResponse<T> | ApiErrorResponse | null = null;
  try {
    body = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;
  } catch {
    body = null;
  }

  if (!response.ok || !body || !body.success) {
    const errorBody = body as ApiErrorResponse | null;
    throw new ApiClientError(
      errorBody?.message || `Request failed with status ${response.status}.`,
      response.status,
      errorBody?.errors
    );
  }

  return body;
}

export async function fetchDashboard(signal?: AbortSignal): Promise<DashboardSummary> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });
  const result = await parseResponse<DashboardSummary>(response);
  return result.data;
}

export async function fetchLeads(options?: {
  search?: string;
  status?: LeadStatus | '';
  signal?: AbortSignal;
}): Promise<Lead[]> {
  const params = new URLSearchParams();
  if (options?.search && options.search.trim()) {
    params.set('search', options.search.trim());
  }
  if (options?.status) {
    params.set('status', options.status);
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/api/leads${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: options?.signal,
  });

  const result = await parseResponse<Lead[]>(response);
  return result.data;
}

export async function fetchLeadById(id: number): Promise<Lead> {
  const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const result = await parseResponse<Lead>(response);
  return result.data;
}

export async function createLead(payload: LeadInput): Promise<Lead> {
  const response = await fetch(`${API_BASE_URL}/api/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const result = await parseResponse<Lead>(response);
  return result.data;
}

export async function updateLead(id: number, payload: LeadInput): Promise<Lead> {
  const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const result = await parseResponse<Lead>(response);
  return result.data;
}

export async function deleteLead(id: number): Promise<{ id: number }> {
  const response = await fetch(`${API_BASE_URL}/api/leads/${id}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  const result = await parseResponse<{ id: number }>(response);
  return result.data;
}
