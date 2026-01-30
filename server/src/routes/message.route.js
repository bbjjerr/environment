const { Router } = require("express");
const messageController = require("../controllers/message.controller");
const { authenticate } = require("../middleware/auth");

const router = Router({ mergeParams: true });

// 所有消息路由都需要认证
router.use(authenticate);

router.get("/conversation/:conversationId", messageController.listMessages);
router.post("/conversation/:conversationId", messageController.createMessage);
router.patch("/:messageId", messageController.updateMessage);
router.delete("/:messageId", messageController.deleteMessage);
router.post("/:messageId/reactions", messageController.addReaction);
router.delete("/:messageId/reactions/:emoji", messageController.removeReaction);
router.post("/:messageId/status", messageController.updateStatus);

module.exports = router;
