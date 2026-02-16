import { AppContent } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 8000);
const CONTENT_RETRIES = Number(import.meta.env.VITE_CONTENT_RETRIES || 2);

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const withTimeout = async <T>(operation: (signal: AbortSignal) => Promise<T>, timeoutMs = API_TIMEOUT_MS): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await operation(controller.signal);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const requestJson = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await withTimeout((signal) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal
    })
  );

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(body || `HTTP ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
};

export const getContent = async (): Promise<AppContent> => {
  let lastError: unknown;
  for (let attempt = 0; attempt <= CONTENT_RETRIES; attempt += 1) {
    try {
      return await requestJson<AppContent>('/api/content');
    } catch (error) {
      lastError = error;
      if (attempt < CONTENT_RETRIES) {
        await wait(500 * (attempt + 1));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new ApiError('Failed to load content');
};

export const saveContent = async (content: AppContent, token: string): Promise<void> => {
  await requestJson<{ ok: boolean }>('/api/content', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(content)
  });
};

export const loginAdmin = async (
  email: string,
  password: string
): Promise<{ token: string; email: string }> => {
  return requestJson<{ token: string; email: string }>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await requestJson<{ ok: boolean; email: string }>('/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return true;
  } catch {
    return false;
  }
};

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  source: 'enquire_now' | 'price_sheet' | 'brochure_download';
  notes?: string;
}

export const submitLead = async (payload: LeadPayload): Promise<void> => {
  await requestJson<{ ok: boolean }>('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
};

export interface LeadRecord {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  source: string;
  notes: string | null;
  created_at: string;
}

export const getLeads = async (token: string): Promise<LeadRecord[]> => {
  const data = await requestJson<{ ok: boolean; leads: LeadRecord[] }>('/api/leads', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data.leads;
};
