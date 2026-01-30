const { Router } = require("express");
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const conversationRoutes = require("./conversation.route");
const messageRoutes = require("./message.route");
const mediaRoutes = require("./media.route");
const notificationRoutes = require("./notification.route");

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);
router.use("/", mediaRoutes); // /uploads, /media
router.use("/notifications", notificationRoutes);

module.exports = router;
