import { getAccessToken } from "./accessTokenMemory";

const authHeaders = () => {
  const token = getAccessToken();
  if (!token) return null;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  return headers;
}

export default authHeaders;