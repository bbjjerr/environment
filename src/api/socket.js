import { io } from "socket.io-client";

// Socket.io 连接实例
const SOCKET_URL = "http://localhost:4000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

// 连接 Socket 并加入用户房间
export const connectSocket = (userId) => {
  if (!userId) return;

  // 如果已经连接，直接加入房间
  if (socket.connected) {
    console.log("Socket 已连接，直接加入房间:", userId);
    socket.emit("join", userId);
    return;
  }

  // 移除旧的监听器避免重复
  socket.off("connect");
  socket.off("disconnect");
  socket.off("connect_error");

  socket.connect();

  socket.on("connect", () => {
    console.log("Socket 连接成功:", socket.id);
    socket.emit("join", userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket 断开连接");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket 连接错误:", error);
  });
};

// 断开 Socket 连接
export const disconnectSocket = () => {
  socket.disconnect();
};

// 监听新消息
export const onNewMessage = (callback) => {
  // 移除旧的监听器避免重复
  socket.off("newMessage");
  socket.on("newMessage", (message) => {
    console.log("Socket 收到新消息:", message);
    callback(message);
  });
};

// 取消监听新消息
export const offNewMessage = () => {
  socket.off("newMessage");
};

export default socket;
