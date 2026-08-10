'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  isTokenValid,
  getUserInfoFromToken,
  UserAuthData,
} from '@/lib/auth';

interface AuthContextType {
  user: UserAuthData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, email?: string, userId?: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserAuthData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  const pathname = usePathname();

  const verifyAndSetAuth = useCallback(() => {
    const currentToken = getAuthToken();

    if (currentToken && isTokenValid(currentToken)) {
      setToken(currentToken);
      setIsAuthenticated(true);
      const userInfo = getUserInfoFromToken(currentToken);
      setUser(userInfo);
      return true;
    } else {
      // Clear token if invalid or expired
      if (currentToken) {
        clearAuthToken();
      }
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  useEffect(() => {
    verifyAndSetAuth();
    setIsLoading(false);
  }, [verifyAndSetAuth]);

  // Periodic token expiration check (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        const isValid = isTokenValid(token);
        if (!isValid) {
          clearAuthToken();
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          if (pathname.startsWith('/dashboard')) {
            router.replace('/login');
          }
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [token, pathname, router]);

  const login = useCallback(
    (newToken: string, email?: string, userId?: string) => {
      setAuthToken(newToken, userId, email);
      setToken(newToken);
      setIsAuthenticated(true);
      const userInfo = getUserInfoFromToken(newToken);
      setUser(userInfo);
    },
    []
  );

  const logout = useCallback(() => {
    clearAuthToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/login');
  }, [router]);

  const checkAuth = useCallback(() => {
    return verifyAndSetAuth();
  }, [verifyAndSetAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
