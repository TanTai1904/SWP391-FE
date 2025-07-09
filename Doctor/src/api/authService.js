import apiClient from "./apiClient";

export async function login(username, password) {
  const res = await apiClient.post("/api/Auth/login", { username, password });
  return res.data;
}

export async function getMe() {
  const res = await apiClient.get("/api/Auth/me");
  return res.data;
}

export async function updatePassword(data) {
  const res = await apiClient.put("/api/Auth/UpdatePassword", data);
  return res.data;
}
