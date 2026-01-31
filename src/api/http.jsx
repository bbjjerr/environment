import axios from "axios";
import { message } from "antd";

const http = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  timeout: 5000,
});

// 请求拦截器：把 Token 塞进 Header
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token_key");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：处理成功解构和错误
http.interceptors.response.use(
  (response) => {
    // 直接返回 response.data，让组件拿数据更方便
    return response.data;
  },
  (error) => {
    const { response, config } = error;
    const status = response?.status;
    // 后端返回的错误消息可能在 message 或 msg 字段
    const errorMessage =
      response?.data?.message || response?.data?.msg || "网络错误";

    // 判断是否是登录/注册请求 (不需要自动跳转)
    const isAuthRequest = config?.url?.includes("/auth/");

    if (status === 401) {
      if (isAuthRequest) {
        // 登录/注册请求的 401：账号或密码错误，不跳转，让组件自己处理
        console.log("登录失败:", errorMessage);
      } else {
        // 其他请求的 401：Token 过期，清除 token 并跳转到登录页
        localStorage.removeItem("token_key");
        message.error("登录过期，请重新登录");
        window.location.href = "/login";
      }
    } else if (status === 409) {
      // 409: 邮箱已注册
      console.log("注册失败:", errorMessage);
    } else if (!isAuthRequest) {
      // 其他错误（非登录注册请求才弹出全局提示）
      message.error(errorMessage);
    }

    return Promise.reject(error);
  },
);

export default http;
