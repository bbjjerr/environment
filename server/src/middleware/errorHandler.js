const createError = require("http-errors");

const notFoundHandler = (_req, _res, next) => {
  next(createError(404, "资源未找到"));
};

const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const payload = {
    error: err.message || "服务器内部错误",
  };

  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
