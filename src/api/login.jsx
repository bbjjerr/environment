import http from "./http";

// 用户注册
export const register = (data) => {
  return http.post("/auth/register", data);
};

// 用户登录
export const login = (data) => {
  return http.post("/auth/login", data);
};
