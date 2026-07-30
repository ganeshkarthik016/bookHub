import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { interactionLimiter } from "../middlewares/rateLimit.middleware.js";
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

router.route("/read-all").patch(interactionLimiter, arkAllAsRead);

router.route("/:notificationId/read").patch(interactionLimiter, arkAsRead);

router.route("/:notificationId").delete(interactionLimiter, deleteNotification);

export default router;