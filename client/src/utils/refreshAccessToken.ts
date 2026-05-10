import serverBaseURL from "./baseURL";
import { clearSession, getSession, setSession } from "./authStorage";
import { setAccessToken } from "./accessTokenMemory";
import type { AuthOK, NotOK } from "../@types/auth";

let inFlight: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    const session = getSession();
    if (!session) {
      clearSession();
      setAccessToken(null);
      throw new Error("No session");
    }

    const response = await fetch(`${serverBaseURL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session)
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as NotOK | null;
      clearSession();
      setAccessToken(null);
      throw new Error(result?.error ?? "Unable to refresh session");
    }

    const result = (await response.json()) as AuthOK;
    setSession({ refreshToken: result.refreshToken, sessionId: result.sessionId });
    setAccessToken(result.accessToken);
    return result.accessToken;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

