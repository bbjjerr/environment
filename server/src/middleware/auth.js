const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

/**
 * 验证 JWT Token 的中间件
 */
const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "未提供认证令牌");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      throw createError(401, "用户不存在");
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(createError(401, "无效的认证令牌"));
    } else if (error.name === "TokenExpiredError") {
      next(createError(401, "认证令牌已过期"));
    } else {
      next(error);
    }
  }
};

/**
 * 可选认证中间件（不强制要求登录）
 */
const optionalAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-passwordHash");

      if (user) {
        req.user = user;
        req.userId = user._id;
      }
    }

    next();
  } catch {
    // 忽略错误，继续处理
    next();
  }
};

/**
 * 生成访问令牌
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

/**
 * 生成刷新令牌
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId, type: "refresh" }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * 验证刷新令牌
 */
const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.type !== "refresh") {
    throw createError(401, "无效的刷新令牌");
  }
  return decoded;
};

module.exports = {
  authenticate,
  optionalAuth,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
