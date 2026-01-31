import axios from "axios";
import { message } from "antd"; // 假设使用 antd 提示

const http = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  timeout: 5000,
});

// 请求拦截器：把 Token 塞进 Header
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token_key");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; //这里加上请求头
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：处理成功解构和 401 错误
http.interceptors.response.use(
  (response) => {
    // 很多后端会包一层 { data: ..., message: ... }
    // 我们在这里直接返回 response.data，让组件拿数据更方便
    return response.data;
  },
  (error) => {
    // 关键设计：统一处理 401
    if (error.response?.status === 401) {
      localStorage.removeItem("token_key");
      message.error("登录过期，请重新登录");
      window.location.href = "/login"; // 瞬间回退
    } else {
      message.error(error.response?.data?.message || "网络错误");
    }
    return Promise.reject(error);
  },
);

export default http;
