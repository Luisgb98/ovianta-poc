'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  email: string;
  login: (email: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const SESSION_COOKIE = 'ovianta-session';

function setSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Strict`;
}

function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Strict`;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authed = localStorage.getItem('ovianta-authed') === '1';
    const savedEmail = localStorage.getItem('ovianta-email') ?? '';
    setIsAuthenticated(authed);
    setEmail(savedEmail);
    setIsLoading(false);
  }, []);

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

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
