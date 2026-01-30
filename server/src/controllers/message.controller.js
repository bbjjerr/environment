const createError = require("http-errors");
const asyncHandler = require("../utils/asyncHandler");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

/**
 * 获取消息列表
 * GET /messages/conversation/:conversationId
 */
const listMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 50, before } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // 验证用户是会话参与者
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.userId,
  });

  if (!conversation) {
    throw createError(404, "会话不存在");
  }

  const query = { conversationId };
  if (before) {
    query.createdAt = { $lt: new Date(before) };
  }

  const [messages, total] = await Promise.all([
    Message.find(query)
      .populate("senderId", "name avatarUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Message.countDocuments(query),
  ]);

  // 格式化返回数据
  const data = messages.reverse().map((msg) => ({
    _id: msg._id,
    conversationId: msg.conversationId,
    senderId: msg.senderId._id,
    sender: {
      name: msg.senderId.name,
      avatarUrl: msg.senderId.avatarUrl,
    },
    body: msg.body,
    attachments: msg.attachments,
    richContent: msg.richContent,
    reactions: msg.reactions,
    status: msg.status,
    createdAt: msg.createdAt,
  }));

  res.json({
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: total > skip + messages.length,
    },
  });
});

/**
 * 发送消息
 * POST /messages/conversation/:conversationId
 */
const createMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { body, attachments, richContent } = req.body;

  // 验证用户是会话参与者
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.userId,
  });

  if (!conversation) {
    throw createError(404, "会话不存在");
  }

  if (!body && (!attachments || attachments.length === 0)) {
    throw createError(400, "消息内容不能为空");
  }

  // 创建消息
  const message = await Message.create({
    conversationId,
    senderId: req.userId,
    body,
    attachments: attachments || [],
    richContent,
    status: "sent",
  });

  // 更新会话的最后一条消息
  conversation.lastMessage = message._id;
  conversation.updatedAt = new Date();

  // 增加其他参与者的未读计数
  conversation.participants.forEach((participantId) => {
    if (participantId.toString() !== req.userId.toString()) {
      const currentCount =
        conversation.unreadCount.get(participantId.toString()) || 0;
      conversation.unreadCount.set(participantId.toString(), currentCount + 1);
    }
  });

  await conversation.save();

  // 返回完整消息
  await message.populate("senderId", "name avatarUrl");

  res.status(201).json({
    _id: message._id,
    conversationId: message.conversationId,
    senderId: message.senderId._id,
    sender: {
      name: message.senderId.name,
      avatarUrl: message.senderId.avatarUrl,
    },
    body: message.body,
    attachments: message.attachments,
    richContent: message.richContent,
    status: message.status,
    createdAt: message.createdAt,
  });
});

/**
 * 编辑消息
 * PATCH /messages/:messageId
 */
const updateMessage = asyncHandler(async (req, res) => {
  const { body } = req.body;

  const message = await Message.findOne({
    _id: req.params.messageId,
    senderId: req.userId,
  });

  if (!message) {
    throw createError(404, "消息不存在或无权编辑");
  }

  // 检查是否在可编辑时间内（如5分钟）
  const editWindow = 5 * 60 * 1000;
  if (Date.now() - message.createdAt.getTime() > editWindow) {
    throw createError(403, "消息已超过可编辑时间");
  }

  message.body = body;
  await message.save();

  res.json(message);
});

/**
 * 删除消息
 * DELETE /messages/:messageId
 */
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findOne({
    _id: req.params.messageId,
    senderId: req.userId,
  });

  if (!message) {
    throw createError(404, "消息不存在或无权删除");
  }

  await Message.findByIdAndDelete(message._id);

  res.status(204).send();
});

/**
 * 添加表情反应
 * POST /messages/:messageId/reactions
 */
const addReaction = asyncHandler(async (req, res) => {
  const { emoji } = req.body;

  if (!emoji) {
    throw createError(400, "请提供表情");
  }

  const message = await Message.findById(req.params.messageId);

  if (!message) {
    throw createError(404, "消息不存在");
  }

  // 检查是否已经添加过相同表情
  const existingIndex = message.reactions.findIndex(
    (r) => r.userId.toString() === req.userId.toString() && r.emoji === emoji,
  );

  if (existingIndex === -1) {
    message.reactions.push({ userId: req.userId, emoji });
    await message.save();
  }

  res.json({ reactions: message.reactions });
});

/**
 * 移除表情反应
 * DELETE /messages/:messageId/reactions/:emoji
 */
const removeReaction = asyncHandler(async (req, res) => {
  const { emoji } = req.params;

  const message = await Message.findById(req.params.messageId);

  if (!message) {
    throw createError(404, "消息不存在");
  }

  message.reactions = message.reactions.filter(
    (r) =>
      !(r.userId.toString() === req.userId.toString() && r.emoji === emoji),
  );

  await message.save();

  res.status(204).send();
});

/**
 * 更新消息状态
 * POST /messages/:messageId/status
 */
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["sent", "delivered", "read"].includes(status)) {
    throw createError(400, "无效的状态值");
  }

  const message = await Message.findByIdAndUpdate(
    req.params.messageId,
    { status },
    { new: true },
  );

  if (!message) {
    throw createError(404, "消息不存在");
  }

  res.json({ messageId: message._id, status: message.status });
});

module.exports = {
  listMessages,
  createMessage,
  updateMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  updateStatus,
};
