const { Router } = require("express");
const notificationController = require("../controllers/notification.controller");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.get("/", authenticate, notificationController.getNotifications);
router.post("/read-all", authenticate, notificationController.markAllAsRead);
router.post(
  "/test",
  authenticate,
  notificationController.createTestNotification,
);
router.patch(
  "/:notificationId",
  authenticate,
  notificationController.updateNotification,
);
router.delete(
  "/:notificationId",
  authenticate,
  notificationController.deleteNotification,
);

module.exports = router;
