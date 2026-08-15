"use client";

/**
 * Cortex AI client-side authentication.
 *
 * This is a clean, framework-agnostic auth layer that is *ready to connect a
 * real backend*. Today it persists a session to localStorage so the landing
 * page and app can route after login/signup without a server. To go live,
 * replace the body of `signIn` / `signUp` / `signOut` with calls to your
 * backend (e.g. `POST /api/auth/login`). The rest of the app only depends on
 * the `useAuth()` surface below, so no other code needs to change.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CortexUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type AuthSession = {
  user: CortexUser;
  token: string;
};

type AuthContextValue = {
  user: CortexUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<CortexUser>;
  signUp: (name: string, email: string, password: string) => Promise<CortexUser>;
  signOut: () => void;
};

const STORAGE_KEY = "cortex-ai.session";

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function writeSession(session: AuthSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function makeToken() {
  // Placeholder token. A real backend issues a JWT / session cookie here.
  return `cortex.${Math.random().toString(36).slice(2)}.${Date.now().toString(36)}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CortexUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = readSession();
    setUser(session?.user ?? null);
    setIsLoading(false);
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, _password: string) => {
      // TODO: replace with `POST /api/auth/signup` against your backend.
      const newUser: CortexUser = {
        id: `user_${Math.random().toString(36).slice(2)}`,
        email,
        name,
        createdAt: new Date().toISOString(),
      };
      writeSession({ user: newUser, token: makeToken() });
      setUser(newUser);
      return newUser;
    },
    [],
  );

  const signIn = useCallback(async (email: string, _password: string) => {
    // TODO: replace with `POST /api/auth/login` against your backend.
    const existing = readSession();
    const loggedIn: CortexUser =
      existing?.user && existing.user.email === email
        ? existing.user
        : {
            id: `user_${Math.random().toString(36).slice(2)}`,
            email,
            name: email.split("@")[0],
            createdAt: new Date().toISOString(),
          };
    writeSession({ user: loggedIn, token: makeToken() });
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, signIn, signUp, signOut }),
    [user, isLoading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
