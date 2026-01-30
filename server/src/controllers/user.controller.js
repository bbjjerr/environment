const createError = require("http-errors");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");

/**
 * 获取当前用户信息
 * GET /users/me
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select("-passwordHash");

  if (!user) {
    throw createError(404, "用户不存在");
  }

  res.json(user);
});

/**
 * 更新当前用户信息
 * PATCH /users/me
 */
const updateMe = asyncHandler(async (req, res) => {
  const { name, title, avatarUrl, settings } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (title !== undefined) updateData.title = title;
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
  if (settings) updateData.settings = settings;

  const user = await User.findByIdAndUpdate(req.userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-passwordHash");

  if (!user) {
    throw createError(404, "用户不存在");
  }

  res.json(user);
});

/**
 * 更新在线状态
 * PUT /users/me/status
 */
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["online", "offline", "away"].includes(status)) {
    throw createError(400, "无效的状态值");
  }

  await User.findByIdAndUpdate(req.userId, { status });

  res.json({ status });
});

/**
 * 搜索用户
 * GET /users?search=xxx&page=1&limit=10
 */
const searchUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select("name email avatarUrl status title")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 }),
    User.countDocuments(query),
  ]);

  res.json({
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    },
  });
});

/**
 * 获取指定用户信息
 * GET /users/:userId
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select(
    "name email avatarUrl status title createdAt",
  );

  if (!user) {
    throw createError(404, "用户不存在");
  }

  res.json(user);
});

module.exports = {
  getMe,
  updateMe,
  updateStatus,
  searchUsers,
  getUserById,
};
