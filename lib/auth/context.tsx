'use client';

import { createContext, use, useCallback, useMemo, useState } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  email: string;
  login: (email: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const SESSION_COOKIE = 'ovianta-session';

function setSessionCookie() {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Strict${secure}`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Strict`;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('ovianta-authed') === '1'
  );
  const [email, setEmail] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('ovianta-email') ?? '') : ''
  );

  const login = useCallback((userEmail: string) => {
    localStorage.setItem('ovianta-authed', '1');
    localStorage.setItem('ovianta-email', userEmail);
    setSessionCookie();
    setEmail(userEmail);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ovianta-authed');
    localStorage.removeItem('ovianta-email');
    clearSessionCookie();
    setIsAuthenticated(false);
    setEmail('');
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, email, login, logout, isLoading: false }),
    [isAuthenticated, email, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
