/**
 * Authentication Context for managing user session state.
 * Provides useAuth hook for accessing auth state and functions throughout the app.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  background: {
    software_experience: string;
    hardware_experience: string;
    programming_languages: string[];
    robotics_background?: string;
    learning_goals?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  signout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // In production (GitHub Pages), use Hugging Face API
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return 'https://naimalcreativityai-physical-ai-chatbot-api.hf.space/api';
  }
  // In development, use local API
  return 'http://localhost:3001/api';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = getApiBaseUrl();

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Signup failed');
      }

      const result = await res.json();
      setUser(result.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err;
    }
  };

  const signin = async (email: string, password: string) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const result = await res.json();
      setUser(result.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  const signout = async () => {
    try {
      await fetch(`${API_BASE}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Signout failed:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signin, signup, signout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
