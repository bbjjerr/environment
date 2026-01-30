const createError = require("http-errors");
const asyncHandler = require("../utils/asyncHandler");
const Notification = require("../models/Notification");

/**
 * 获取通知列表
 * GET /notifications
 */
const getNotifications = asyncHandler(async (req, res) => {
  const { isRead, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = { userId: req.userId };
  if (isRead !== undefined) {
    query.isRead = isRead === "true";
  }

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Notification.countDocuments(query),
  ]);

  res.json({
    data: notifications,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    },
  });
});

/**
 * 更新通知状态
 * PATCH /notifications/:notificationId
 */
const updateNotification = asyncHandler(async (req, res) => {
  const { isRead } = req.body;

  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.notificationId, userId: req.userId },
    { isRead },
    { new: true },
  );

  if (!notification) {
    throw createError(404, "通知不存在");
  }

  res.json(notification);
});

/**
 * 标记所有通知为已读
 * POST /notifications/read-all
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { userId: req.userId, isRead: false },
    { isRead: true },
  );

  res.json({ message: "所有通知已标记为已读" });
});

/**
 * 删除通知
 * DELETE /notifications/:notificationId
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.notificationId,
    userId: req.userId,
  });

  if (!notification) {
    throw createError(404, "通知不存在");
  }

  res.status(204).send();
});

/**
 * 测试通知（仅开发环境）
 * POST /notifications/test
 */
const createTestNotification = asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    throw createError(403, "该功能仅在开发环境可用");
  }

  const notification = await Notification.create({
    userId: req.userId,
    type: "test",
    payload: { message: "这是一条测试通知" },
    isRead: false,
  });

  res.status(201).json(notification);
});

module.exports = {
  getNotifications,
  updateNotification,
  markAllAsRead,
  deleteNotification,
  createTestNotification,
};
