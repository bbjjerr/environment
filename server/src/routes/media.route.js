const { Router } = require("express");
const mediaController = require("../controllers/media.controller");
const { authenticate } = require("../middleware/auth");

const router = Router();

// 文件上传
router.post("/uploads", authenticate, mediaController.uploadFile);

// 下载文件
router.get(
  "/media/:assetId/download",
  authenticate,
  mediaController.downloadFile,
);

// 获取会话媒体列表（也可以放在 conversation 路由中）
router.get(
  "/conversations/:conversationId/media",
  authenticate,
  mediaController.getConversationMedia,
);

module.exports = router;
