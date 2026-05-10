const REFRESH_TOKEN_KEY = "refreshToken";
const SESSION_ID_KEY = "sessionId";

export type StoredSession = {
  refreshToken: string;
  sessionId: string;
};

export function getSession(): StoredSession | null {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!refreshToken || !sessionId) return null;
  return { refreshToken, sessionId };
}

export function setSession(session: StoredSession) {
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  localStorage.setItem(SESSION_ID_KEY, session.sessionId);
}

export function clearSession() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
}

