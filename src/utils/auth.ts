// src/utils/auth.ts - SpiceForge authentication (demo + real API modes)
//
// In demo mode (VITE_DEMO_MODE=true) authentication is handled entirely in
// the browser against the mock user database (src/mock/db.ts).
// In real mode the Laravel API is used via fetch.

import { DEMO_MODE } from '../mock/config';
import { db, saveDB, nextId, now } from '../mock/db';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  errors?: Record<string, string[]>;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

const persistAuth = (user: User, token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const toPublicUser = (u: { id: number; name: string; email: string; created_at: string; updated_at: string }): User => ({
  id: u.id,
  name: u.name,
  email: u.email,
  email_verified_at: null,
  created_at: u.created_at,
  updated_at: u.updated_at,
});

// ============ DEMO MODE ============

const demoLogin = (email: string, password: string): AuthResponse => {
  const normalized = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalized);

  if (!user || user.password !== password) {
    return {
      success: false,
      message: 'Invalid email or password. Demo credentials: example@example.com / 123456',
    };
  }

  const publicUser = toPublicUser(user);
  const token = `demo-token-${user.id}-${Date.now()}`;
  persistAuth(publicUser, token);

  return {
    success: true,
    message: 'Login successful! (Demo Mode)',
    user: publicUser,
    token,
  };
};

const demoRegister = (name: string, email: string, password: string): AuthResponse => {
  const normalized = email.trim().toLowerCase();

  if (!name.trim()) {
    return { success: false, message: 'Name is required.' };
  }
  if (!/^\S+@\S+\.\S+$/.test(normalized)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' };
  }
  if (db.users.some((u) => u.email.toLowerCase() === normalized)) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  const timestamp = now();
  const newUser = {
    id: nextId(db.users),
    name: name.trim(),
    email: normalized,
    password,
    role: 'viewer',
    created_at: timestamp,
    updated_at: timestamp,
  };
  db.users.push(newUser);
  saveDB();

  const publicUser = toPublicUser(newUser);
  const token = `demo-token-${newUser.id}-${Date.now()}`;
  persistAuth(publicUser, token);

  return {
    success: true,
    message: 'Registration successful! (Demo Mode)',
    user: publicUser,
    token,
  };
};

// ============ REGISTER ============

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  if (DEMO_MODE) {
    return demoRegister(name, email, password);
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }

      return {
        success: true,
        message: data.message || 'Registration successful!',
        user: data.user,
        token: data.token,
      };
    }

    if (data.errors) {
      const errorMessages = Object.values(data.errors).flat() as string[];
      return {
        success: false,
        message: errorMessages[0] || 'Validation failed',
      };
    }

    return {
      success: false,
      message: data.message || 'Registration failed',
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Network error. Please check if the backend server is running.',
    };
  }
};

// ============ LOGIN ============

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  if (DEMO_MODE) {
    return demoLogin(email, password);
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }

      return {
        success: true,
        message: data.message || 'Login successful!',
        user: data.user,
        token: data.token,
      };
    }

    if (data.success === false && data.message) {
      return {
        success: false,
        message: data.message,
      };
    }

    return {
      success: false,
      message: 'Login failed. Please try again.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Network error. Please check if the backend server is running.',
    };
  }
};

// ============ LOGOUT ============

export const logout = async (): Promise<void> => {
  if (!DEMO_MODE) {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
      });
    } catch (error) {
      // Ignore network errors during logout
    }
  }

  // Always clear local state
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ============ GET CURRENT USER ============

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    return null;
  }
};

// Get the auth token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// ============ FETCH USER ============

export const fetchUser = async (): Promise<User | null> => {
  if (DEMO_MODE) {
    return getCurrentUser();
  }

  try {
    const response = await fetch(`${API_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data.user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
