const { Router } = require("express");
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth");

const router = Router();

// 需要认证的路由
router.get("/me", authenticate, userController.getMe);
router.patch("/me", authenticate, userController.updateMe);
router.put("/me/status", authenticate, userController.updateStatus);

// 公开或需认证的路由
router.get("/", authenticate, userController.searchUsers);
router.get("/:userId", authenticate, userController.getUserById);

module.exports = router;
