import api from "./axios";

export const login = async (username: string, password: string) => {
  const res = await api.post("/auth/login", { username, password });
  return res.data as { token: string };
};

export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
