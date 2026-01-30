/**
 * 数据库种子数据
 * 运行: node src/seed.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/getTheReact";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // 清空现有数据
    await User.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    console.log("Cleared existing data");

    // 创建用户
    const passwordHash = await bcrypt.hash("123456", 12);

    const alex = await User.create({
      name: "Alex Chen",
      email: "alex@example.com",
      passwordHash,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      title: "Frontend Developer",
      status: "online",
    });

    const sarah = await User.create({
      name: "Sarah Wilson",
      email: "sarah@example.com",
      passwordHash,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      title: "Frontend Developer",
      status: "online",
    });

    const michael = await User.create({
      name: "Michael Brown",
      email: "michael@example.com",
      passwordHash,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      title: "Backend Developer",
      status: "offline",
    });

    const team = await User.create({
      name: "Design Team Sync",
      email: "team@example.com",
      passwordHash,
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Team",
      title: "Design Team",
      status: "away",
    });

    console.log("Created users");

    // 创建会话
    const conv1 = await Conversation.create({
      type: "direct",
      participants: [alex._id, sarah._id],
      unreadCount: new Map([
        [alex._id.toString(), 0],
        [sarah._id.toString(), 0],
      ]),
    });

    const conv2 = await Conversation.create({
      type: "direct",
      participants: [alex._id, michael._id],
      unreadCount: new Map([
        [alex._id.toString(), 1],
        [michael._id.toString(), 0],
      ]),
    });

    const conv3 = await Conversation.create({
      type: "group",
      name: "Design Team Sync",
      participants: [alex._id, sarah._id, michael._id],
      unreadCount: new Map([
        [alex._id.toString(), 0],
        [sarah._id.toString(), 0],
        [michael._id.toString(), 0],
      ]),
    });

    console.log("Created conversations");

    // 创建消息 - Alex 和 Sarah 的对话
    const messages = [
      {
        conversationId: conv1._id,
        senderId: alex._id,
        body: "Hi Sarah, 昨天发的 Dashboard UI 你看了吗?",
        status: "read",
        createdAt: new Date("2026-01-29T10:00:00Z"),
      },
      {
        conversationId: conv1._id,
        senderId: sarah._id,
        body: "嗨 Alex! 看了，整体感觉非常干净现代。",
        status: "read",
        createdAt: new Date("2026-01-29T10:05:00Z"),
      },
      {
        conversationId: conv1._id,
        senderId: sarah._id,
        body: "特别是暗色模式的配色方案，我很喜欢。",
        status: "read",
        createdAt: new Date("2026-01-29T10:05:30Z"),
      },
      {
        conversationId: conv1._id,
        senderId: alex._id,
        body: "太好了！我也觉得 Indigo 那个色系很适合。",
        status: "read",
        createdAt: new Date("2026-01-29T10:10:00Z"),
      },
      {
        conversationId: conv1._id,
        senderId: sarah._id,
        body: "设计稿看起来很棒！🔥",
        status: "delivered",
        createdAt: new Date("2026-01-29T10:30:00Z"),
      },
    ];

    // Alex 和 Michael 的对话
    messages.push({
      conversationId: conv2._id,
      senderId: michael._id,
      body: "你: 不太对 你绝的呢",
      status: "delivered",
      createdAt: new Date("2026-01-29T12:07:00Z"),
    });

    // 群组消息
    messages.push({
      conversationId: conv3._id,
      senderId: sarah._id,
      body: "大家呈看一下新需求",
      status: "read",
      createdAt: new Date("2026-01-29T09:15:00Z"),
    });

    await Message.insertMany(messages);
    console.log("Created messages");

    // 更新会话的最后一条消息
    const lastMsg1 = await Message.findOne({ conversationId: conv1._id }).sort({
      createdAt: -1,
    });
    const lastMsg2 = await Message.findOne({ conversationId: conv2._id }).sort({
      createdAt: -1,
    });
    const lastMsg3 = await Message.findOne({ conversationId: conv3._id }).sort({
      createdAt: -1,
    });

    await Conversation.findByIdAndUpdate(conv1._id, {
      lastMessage: lastMsg1._id,
    });
    await Conversation.findByIdAndUpdate(conv2._id, {
      lastMessage: lastMsg2._id,
    });
    await Conversation.findByIdAndUpdate(conv3._id, {
      lastMessage: lastMsg3._id,
    });

    console.log("Updated conversations with last messages");

    console.log("\n✅ Seed data created successfully!");
    console.log("\nTest accounts:");
    console.log("  Email: alex@example.com");
    console.log("  Email: sarah@example.com");
    console.log("  Email: michael@example.com");
    console.log("  Password: 123456 (for all accounts)");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
