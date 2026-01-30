const { Router } = require("express");
const conversationController = require("../controllers/conversation.controller");
const { authenticate } = require("../middleware/auth");

const router = Router();

// 所有会话路由都需要认证
router.use(authenticate);

router.get("/", conversationController.listConversations);
router.post("/", conversationController.createConversation);
router.get("/:conversationId", conversationController.getConversationById);
router.patch("/:conversationId", conversationController.updateConversation);
router.post(
  "/:conversationId/unread/reset",
  conversationController.resetUnreadCount,
);
router.delete("/:conversationId", conversationController.deleteConversation);

module.exports = router;
