require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connectDB } = require("./config/db");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  // 配置 Socket.io
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 存储用户连接
  const userSockets = new Map();

  io.on("connection", (socket) => {
    console.log("用户连接:", socket.id);

    // 用户加入房间
    socket.on("join", (userId) => {
      userSockets.set(userId, socket.id);
      socket.join(userId);
      console.log(`用户 ${userId} 加入房间`);
    });

    // 断开连接
    socket.on("disconnect", () => {
      console.log("用户断开:", socket.id);
      // 清理用户连接
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });

  // 将 io 实例挂载到 app 上，供其他地方使用
  app.set("io", io);
  app.set("userSockets", userSockets);

  server.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
