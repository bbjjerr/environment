import { createSlice } from "@reduxjs/toolkit";

const commentStore = createSlice({
  name: "comment",
  // 初始状态
  initialState: {
    currentConversation: null, // 当前选中的会话
    messages: [], // 当前会话的消息列表
    list: [], // 保持向后兼容
    conversationListVersion: 0, // 用于触发会话列表刷新
  },
  // 修改状态的方法
  reducers: {
    // 设置当前会话和消息
    setCurrentChat(state, action) {
      const { conversation, messages } = action.payload;
      state.currentConversation = conversation;
      state.messages = messages || [];
      state.list = conversation; // 向后兼容
      console.log(
        "设置当前会话:",
        conversation?.name || conversation?.participants?.[0]?.name,
      );
    },
    // 添加新消息到当前会话
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    // 清空当前会话
    clearChat(state) {
      state.currentConversation = null;
      state.messages = [];
      state.list = [];
    },
    // 触发会话列表刷新
    triggerListRefresh(state) {
      state.conversationListVersion += 1; //
    },
    // 兼容旧的 addComment
    addComment(state, action) {
      state.list = action.payload;
    },
    cleatComment(state) {
      state.list = [];
    },
  },
});

// 导出 action 函数，供组件调用
export const {
  setCurrentChat,
  addMessage,
  clearChat,
  triggerListRefresh,
  addComment,
  cleatComment,
} = commentStore.actions;
// 导出 reducer，供创建 store 使用
export default commentStore.reducer;
