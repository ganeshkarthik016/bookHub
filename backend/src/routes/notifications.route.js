import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Adjust path as needed
import {
    getUnreadCount,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/count").get(getUnreadCount);

router.route("/").get(getNotifications);

router.route("/read-all").patch(markAllAsRead);

router.route("/:notificationId/read").patch(markAsRead);

router.route("/:notificationId").delete(deleteNotification);

export default router;