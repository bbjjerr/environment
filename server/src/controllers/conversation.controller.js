const createError = require("http-errors");
const asyncHandler = require("../utils/asyncHandler");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Message = require("../models/Message");

/**
 * 获取会话列表
 * GET /conversations
 */
const listConversations = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = { participants: req.userId };
  if (type) {
    query.type = type;
  }

  const conversations = await Conversation.find(query)
    .populate("participants", "name email avatarUrl status title")
    .populate({
      path: "lastMessage",
      select: "body senderId createdAt",
      populate: {
        path: "senderId",
        select: "name avatarUrl",
      },
    })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Conversation.countDocuments(query);

  // 格式化返回数据
  const data = conversations.map((conv) => {
    const unreadCount = conv.unreadCount?.get(req.userId.toString()) || 0;
    const isPinned = conv.pinnedBy?.includes(req.userId) || false;

    return {
      _id: conv._id,
      type: conv.type,
      name: conv.name,
      participants: conv.participants.filter(
        (p) => p._id.toString() !== req.userId.toString(),
      ),
      lastMessage: conv.lastMessage,
      unreadCount,
      isPinned,
      updatedAt: conv.updatedAt,
    };
  });

  res.json({
    data,
    pagination: { page: parseInt(page), limit: parseInt(limit), total },
  });
});

/**
 * 创建会话
 * POST /conversations
 */
const createConversation = asyncHandler(async (req, res) => {
  const { participantIds, type = "direct", name } = req.body;

  if (!participantIds || !Array.isArray(participantIds)) {
    throw createError(400, "请提供参与者ID列表");
  }

  // 确保当前用户在参与者中
  const allParticipants = [
    ...new Set([req.userId.toString(), ...participantIds]),
  ];

  // 验证所有用户存在
  const users = await User.find({ _id: { $in: allParticipants } });
  if (users.length !== allParticipants.length) {
    throw createError(400, "部分用户不存在");
  }

  // 对于私聊，检查是否已存在
  if (type === "direct" && allParticipants.length === 2) {
    const existing = await Conversation.findOne({
      type: "direct",
      participants: { $all: allParticipants, $size: 2 },
    });
    if (existing) {
      return res.json(existing);
    }
  }

  const conversation = await Conversation.create({
    type,
    name,
    participants: allParticipants,
  });

  await conversation.populate("participants", "name email avatarUrl status");

  res.status(201).json(conversation);
});

/**
 * 获取会话详情
 * GET /conversations/:conversationId
 */
const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.conversationId,
    participants: req.userId,
  })
    .populate("participants", "name email avatarUrl status title")
    .populate("lastMessage");

  if (!conversation) {
    throw createError(404, "会话不存在");
  }

  res.json(conversation);
});

/**
 * 更新会话
 * PATCH /conversations/:conversationId
 */
const updateConversation = asyncHandler(async (req, res) => {
  const { name, isPinned, isMuted } = req.body;
  const { conversationId } = req.params;

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: req.userId,
  });

  if (!conversation) {
    throw createError(404, "会话不存在");
  }

  // 更新名称
  if (name !== undefined) {
    conversation.name = name;
  }

  // 更新置顶状态
  if (isPinned !== undefined) {
    if (isPinned) {
      if (!conversation.pinnedBy.includes(req.userId)) {
        conversation.pinnedBy.push(req.userId);
      }
    } else {
      conversation.pinnedBy = conversation.pinnedBy.filter(
        (id) => id.toString() !== req.userId.toString(),
      );
    }
  }

  await conversation.save();

  res.json(conversation);
});

/**
 * 清空未读
 * POST /conversations/:conversationId/unread/reset
 */
const resetUnreadCount = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.conversationId,
    participants: req.userId,
  });

  if (!conversation) {
    throw createError(404, "会话不存在");
  }

  conversation.unreadCount.set(req.userId.toString(), 0);
  await conversation.save();

  res.json({ unreadCount: 0 });
});

/**
 * 删除会话（软删除）
 * DELETE /conversations/:conversationId
 */
const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findOne({
    _id: req.params.conversationId,
    participants: req.userId,
  });

  if (!conversation) {
    throw createError(404, "会话不存在");
  }

  // 从参与者中移除当前用户
  conversation.participants = conversation.participants.filter(
    (id) => id.toString() !== req.userId.toString(),
  );

  // 如果没有参与者了，删除会话
  if (conversation.participants.length === 0) {
    await Conversation.findByIdAndDelete(conversation._id);
  } else {
    await conversation.save();
  }

  res.status(204).send();
});

module.exports = {
  listConversations,
  createConversation,
  getConversationById,
  updateConversation,
  resetUnreadCount,
  deleteConversation,
};
