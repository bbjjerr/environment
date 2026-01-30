import { createSlice } from "@reduxjs/toolkit";

const commentStore = createSlice({
  name: "comment",
  // 初始状态
  initialState: {
    list: [],
  },
  // 修改状态的方法
  reducers: {
    addComment(state, action) {
      state.list = action.payload;
      console.log("添加了评论：", action.payload);
    },
    cleatComment(state) {
      state.list = [];
    },
  },
});

// 导出 action 函数，供组件调用
export const { addComment, cleatComment } = commentStore.actions;
// 导出 reducer，供创建 store 使用
export default commentStore.reducer;
