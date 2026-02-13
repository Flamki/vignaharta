import { AppContent } from '../types';
import { DEFAULT_CONTENT } from '../constants';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');

const requestJson = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const getContent = async (): Promise<AppContent> => {
  try {
    return await requestJson<AppContent>('/api/content');
  } catch (e) {
    console.error('Failed to load content from backend, using defaults', e);
    return DEFAULT_CONTENT;
  }
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
