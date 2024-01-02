const authHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  return headers;
}

export default authHeaders;