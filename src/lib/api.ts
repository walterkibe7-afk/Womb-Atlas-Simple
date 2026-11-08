const API_BASE = 'http://127.0.0.1:4001';

const TOKEN_KEY = 'wombatlas:v1:api-token';

export interface ApiError {
  status: number;
  message: string;
  retryAfterSeconds?: number;
}

export interface HealthResponse {
  ok: boolean;
}

export interface User {
  id: string;
  handle: string;
  name: string;
}

export interface Profile {
  lastPeriodStart?: string;
  lifeStage?: 'currently-cycling' | 'postpartum' | 'perimenopause' | 'pregnant-recovering' | 'not-sure';
  cycleLength: number;
  periodLength: number;
  usesHormonalBirthControl: boolean;
  hasCompletedOnboarding: boolean;
}

export interface MeResponse {
  user: User;
  profile: Profile;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Entry {
  date: string;
  cycleDay: number;
  flow: 'spotting' | 'light' | 'medium' | 'heavy' | 'none';
  pain: number;
  symptoms: string[];
  mood?: 'calm' | 'reflective' | 'sensitive' | 'low-energy' | 'grounded' | 'tender';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntriesResponse {
  entries: Entry[];
}

export interface PutEntryResponse {
  entry: Entry;
}

export interface DeleteResponse {
  ok: boolean;
}

let currentToken: string | null = null;

export function setToken(token: string | null): void {
  currentToken = token;
}

export function getToken(): string | null {
  return currentToken;
}

export function saveToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
  currentToken = token;
}

export function loadToken(): string | null {
  const token = sessionStorage.getItem(TOKEN_KEY);
  currentToken = token;
  return token;
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  currentToken = null;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (currentToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${currentToken}`;
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let message = 'Request failed';
      let retryAfterSeconds: number | undefined;
      try {
        const errorData = await response.json();
        message = errorData.error || message;
        retryAfterSeconds = errorData.retryAfterSeconds;
      } catch {
        message = response.statusText || message;
      }
      throw { status: response.status, message, retryAfterSeconds } as ApiError;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }
    throw { status: 0, message: 'Network error' } as ApiError;
  }
}

export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/api/health', { method: 'GET' });
}

export async function register(handle: string, pin: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/register', {
    method: 'POST',
    body: JSON.stringify({ handle, pin }),
  });
}

export async function createSession(handle: string, pin: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/session', {
    method: 'POST',
    body: JSON.stringify({ handle, pin }),
  });
}

export async function getMe(): Promise<MeResponse> {
  return request<MeResponse>('/api/me', { method: 'GET' });
}

export async function updateMe(patch: Partial<Profile> & { name?: string }): Promise<MeResponse> {
  return request<MeResponse>('/api/me', {
    method: 'PUT',
    body: JSON.stringify(patch),
  });
}

export async function listEntries(params?: { from?: string; to?: string }): Promise<EntriesResponse> {
  const query = new URLSearchParams();
  if (params?.from) query.set('from', params.from);
  if (params?.to) query.set('to', params.to);
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return request<EntriesResponse>(`/api/entries${queryString}`, { method: 'GET' });
}

export async function putEntry(date: string, entry: Omit<Entry, 'date' | 'createdAt' | 'updatedAt'>): Promise<PutEntryResponse> {
  return request<PutEntryResponse>(`/api/entries/${date}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  });
}

export async function deleteEntry(date: string): Promise<DeleteResponse> {
  return request<DeleteResponse>(`/api/entries/${date}`, { method: 'DELETE' });
}

export async function deleteSession(): Promise<DeleteResponse> {
  return request<DeleteResponse>('/api/session', { method: 'DELETE' });
}

export const TokenStore = {
  saveToken,
  loadToken,
  clearToken,
};