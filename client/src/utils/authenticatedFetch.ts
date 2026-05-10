import { getAccessToken } from "./accessTokenMemory";
import { getSession } from "./authStorage";
import { refreshAccessToken } from "./refreshAccessToken";

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const attempt = async () => {
    const headers = new Headers(init.headers);
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  };

  let response = await attempt();
  if (response.status !== 401) return response;

  // No session means we cannot refresh; return original 401.
  if (!getSession()) return response;

  try {
    await refreshAccessToken();
  } catch {
    return response;
  }

  // Retry once with the refreshed access token.
  response = await attempt();
  return response;
}

