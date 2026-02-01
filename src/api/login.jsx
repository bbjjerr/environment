import http from "./http";

// 用户注册
export const register = (data) => {
  return http.post("/auth/register", data);
};

// 用户登录
export const login = (data) => {
  return http.post("/auth/login", data);
};
//获取当前用户信息
export const getCurrentUser = () => {
  return http.get("/users/me");
};
//搜索用户
export const searchUser = (params) => {
  return http.get("/users", { params });
};
//获取会话列表
export const getConversationList = (params) => {
  return http.get("/conversations", { params });
};
//创建会话
export const createConversation = (data) => {
  return http.post("/conversations", data);
};
//获取特定会话的详细信息
export const getConversationDetail = (conversationId) => {
  return http.get(`/conversations/${conversationId}`);
};

// ========== 消息相关 API ==========

// 获取会话消息列表
export const getConversationMessages = (conversationId, params) => {
  return http.get(`/messages/conversation/${conversationId}`, { params });
};

// 发送消息
export const sendMessage = (conversationId, data) => {
  return http.post(`/messages/conversation/${conversationId}`, data);
};
