// src/utils/api.ts - API helper for SpiceForge
import { DEMO_MODE } from '../mock/config';
import { mockRequest } from '../mock/mockApi';
import { getToken, logout } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  const { requiresAuth = true, ...fetchOptions } = options;

  // In demo mode route through the in-browser mock API.
  if (DEMO_MODE) {
    const method = (fetchOptions.method || 'GET').toLowerCase();
    const body = fetchOptions.body ? JSON.parse(String(fetchOptions.body)) : undefined;
    return (await mockRequest({
      method,
      url: endpoint,
      data: body,
      params: undefined,
      responseType: undefined,
    })) as T;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (fetchOptions.headers) {
    Object.entries(fetchOptions.headers as Record<string, string>).forEach(
      ([key, value]) => (headers[key] = value)
    );
  }

  if (requiresAuth) {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Handle unauthorized
  if (response.status === 401) {
    await logout();
    window.location.href = '/signin';
    throw new Error('Session expired. Please login again.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Helper methods
export const api = {
  get: <T = any>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T = any>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T = any>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T = any>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};