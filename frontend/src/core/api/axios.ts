// src/core/api/axios.ts
// Axios-compatible API client for SpiceForge.
//
// In demo mode (VITE_DEMO_MODE=true) all requests are served by the in-browser
// mock API (see src/mock) so the app runs fully offline. In real mode the
// Laravel backend at VITE_API_URL is used.

import axios from 'axios';
import { DEMO_MODE } from '../../mock/config';
import { mockRequest } from '../../mock/mockApi';

interface MockClient {
  get: (url: string, config?: any) => Promise<{ data: any; status: number }>;
  post: (url: string, data?: any, config?: any) => Promise<{ data: any; status: number }>;
  put: (url: string, data?: any, config?: any) => Promise<{ data: any; status: number }>;
  patch: (url: string, data?: any, config?: any) => Promise<{ data: any; status: number }>;
  delete: (url: string, config?: any) => Promise<{ data: any; status: number }>;
  interceptors: {
    request: { use: (fn: any) => number; eject: (id: number) => void };
    response: { use: (fn: any) => number; eject: (id: number) => void };
  };
  defaults: Record<string, any>;
}

const createMockClient = (): MockClient => {
  const request = async (method: string, url: string, data?: unknown, config?: any) => {
    const payload = await mockRequest({
      method,
      url,
      data,
      params: config?.params,
      responseType: config?.responseType,
    });
    return { data: payload, status: 200 };
  };

  return {
    get: (url, config) => request('get', url, undefined, config),
    post: (url, data, config) => request('post', url, data, config),
    put: (url, data, config) => request('put', url, data, config),
    patch: (url, data, config) => request('patch', url, data, config),
    delete: (url, config) => request('delete', url, undefined, config),
    interceptors: {
      request: { use: () => 0, eject: () => undefined },
      response: { use: () => 0, eject: () => undefined },
    },
    defaults: {},
  };
};

const createRealClient = () => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Add token to requests
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Handle 401 responses
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const api = DEMO_MODE ? createMockClient() : createRealClient();

export default api;
