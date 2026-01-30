const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

// CORS 配置
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 静态文件服务（上传的文件）
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 健康检查
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API 路由
app.use("/api/v1", routes);

// 错误处理
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
