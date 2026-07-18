"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authenticateDemoCredentials, parseAuthSession } from "@/auth/access";
import { clearStoredSessions } from "@/auth/storage";
import type { AuthContextValue, AuthSession, LoginInput } from "@/auth/types";
import { AUTH_STORAGE_KEYS } from "@/config/demo-auth";

const AuthContext = createContext<AuthContextValue | null>(null);

function browserStorage(kind: "localStorage" | "sessionStorage") {
  try {
    return window[kind];
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const sessionStore = browserStorage("sessionStorage");
        const localStore = browserStorage("localStorage");
        const sessionValue = sessionStore?.getItem(AUTH_STORAGE_KEYS.session) ?? null;
        const localValue = localStore?.getItem(AUTH_STORAGE_KEYS.local) ?? null;
        const parsedSession = parseAuthSession(sessionValue);
        const parsedLocal = parseAuthSession(localValue);

        if (sessionValue && !parsedSession) sessionStore?.removeItem(AUTH_STORAGE_KEYS.session);
        if (localValue && !parsedLocal) localStore?.removeItem(AUTH_STORAGE_KEYS.local);
        setSession(parsedSession ?? parsedLocal);
      } catch {
        setSession(null);
      }
      setIsHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    role: session?.role ?? "public",
    isAuthenticated: session !== null,
    isHydrated,
    login(input: LoginInput) {
      const result = authenticateDemoCredentials(input);
      if (!result.ok) return result;

      const localStore = browserStorage("localStorage");
      const sessionStore = browserStorage("sessionStorage");
      clearStoredSessions(localStore, sessionStore);
      const storage = input.rememberSession ? localStore : sessionStore;
      const key = input.rememberSession ? AUTH_STORAGE_KEYS.local : AUTH_STORAGE_KEYS.session;
      try {
        storage?.setItem(key, JSON.stringify(result.session));
      } catch {
        // Demo access still works in memory when browser storage is unavailable.
      }
      setSession(result.session);
      return result;
    },
    logout() {
      clearStoredSessions(browserStorage("localStorage"), browserStorage("sessionStorage"));
      setSession(null);
    },
  }), [isHydrated, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
