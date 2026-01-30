const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../middleware/auth");

/**
 * 用户注册
 * POST /auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw createError(400, "请提供完整的注册信息");
  }

  // 检查邮箱是否已注册
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw createError(409, "该邮箱已被注册");
  }

  // 密码加密
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // 创建用户
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    status: "offline",
  });

  // 生成令牌
  const token = generateAccessToken(user._id);

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      status: user.status,
      createdAt: user.createdAt,
    },
    token,
  });
});

/**
 * 用户登录
 * POST /auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createError(400, "请提供邮箱和密码");
  }

  // 查找用户
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw createError(401, "邮箱或密码错误");
  }

  // 验证密码
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw createError(401, "邮箱或密码错误");
  }

  // 更新在线状态
  user.status = "online";
  await user.save();

  // 生成令牌
  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      title: user.title,
      status: user.status,
    },
    token,
    refreshToken,
  });
});

/**
 * 刷新访问令牌
 * POST /auth/refresh
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    throw createError(400, "请提供刷新令牌");
  }

  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw createError(401, "用户不存在");
  }

  const newToken = generateAccessToken(user._id);

  res.json({ token: newToken });
});

/**
 * 退出登录
 * POST /auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  // 如果有用户信息，更新在线状态
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { status: "offline" });
  }

  res.status(204).send();
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
