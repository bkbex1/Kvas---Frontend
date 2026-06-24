import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiGet, apiSend } from '@/lib/api';

const TOKEN_KEY = 'kvas_token';

type AuthUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  role?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await apiGet<AuthUser>('/api/auth/me');
      setUser(me);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiSend<{ token: string; user: AuthUser }>('/api/auth/login', 'POST', { email, password });
    localStorage.setItem(TOKEN_KEY, response.token);
    setUser(response.user);
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await apiSend<{ token: string; user: AuthUser }>('/api/auth/register', 'POST', {
      firstName,
      lastName,
      email,
      password,
    });
    localStorage.setItem(TOKEN_KEY, response.token);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await apiSend('/api/auth/logout', 'POST');
    } catch {
      // ignore network issues; clear local session anyway
    }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

