import http from "./http";

export const login = (data) => {
  return http.post("/auth/register", data);
};
