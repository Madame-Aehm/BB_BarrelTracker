/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, PropsWithChildren, createContext, useCallback, useEffect, useMemo, useState } from "react";
import serverBaseURL from "../utils/baseURL";
import { clearSession, getSession, setSession } from "../utils/authStorage";
import { setAccessToken as setAccessTokenInMemory } from "../utils/accessTokenMemory";
import type { AuthOK, NotOK } from "../@types/auth";

interface AuthContextType {
  auth: boolean
  setAuth: Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  error: string
  loginWithPin: (pin: string) => Promise<void>
  logout: () => Promise<void>
}

const defaultValue: AuthContextType = {
  auth: false,
  setAuth: () => { throw new Error("No Provider") },
  loading: true,
  setLoading: () => { throw new Error("No Provider") },
  error: "",
  loginWithPin: () => { throw new Error("No Provider") },
  logout: () => { throw new Error("No Provider") }
}

export const AuthContext = createContext(defaultValue);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const clearClientAuth = useCallback(() => {
    clearSession();
    setAccessTokenInMemory(null);
    setAuth(false);
  }, []);

  const refresh = useCallback(async () => {
    const session = getSession();
    if (!session) throw new Error("No session");

    const response = await fetch(`${serverBaseURL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session)
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as NotOK | null;
      throw new Error(result?.error ?? "Unable to refresh session");
    }

    const result = (await response.json()) as AuthOK;
    setSession({ refreshToken: result.refreshToken, sessionId: result.sessionId });
    setAccessTokenInMemory(result.accessToken);
    setAuth(true);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      setError("");
      const session = getSession();
      if (!session) {
        setAuth(false);
        setLoading(false);
        return;
      }
      try {
        await refresh();
      } catch (e) {
        const { message } = e as Error;
        setError(message);
        clearClientAuth();
      } finally {
        setLoading(false);
      }
    };
    bootstrap().catch(() => setLoading(false));
  }, [refresh, clearClientAuth]);

  const loginWithPin = useCallback(async (pin: string) => {
    setLoading(true);
    setError("");
    const body = new URLSearchParams();
    body.append("pin", pin);
    try {
      const response = await fetch(`${serverBaseURL}/api/auth/authenticate`, { body, method: "POST" });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as NotOK | null;
        throw new Error(result?.error ?? "Authentication failed");
      }
      const result = (await response.json()) as AuthOK;
      setSession({ refreshToken: result.refreshToken, sessionId: result.sessionId });
      setAccessTokenInMemory(result.accessToken);
      setAuth(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const session = getSession();
      if (session?.sessionId) {
        await fetch(`${serverBaseURL}/api/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: session.sessionId })
        }).catch(() => null);
      }
    } finally {
      clearClientAuth();
      setLoading(false);
    }
  }, [clearClientAuth]);

  const value = useMemo(
    () => ({ auth, setAuth, loading, setLoading, error, loginWithPin, logout }),
    [auth, loading, error, loginWithPin, logout]
  );

  return <AuthContext.Provider value={value}>
    { children }
  </AuthContext.Provider>
}