import { Notification } from "../models/notification.model.js";
import { redisClient, unreadKey, countKey } from "./redis.js";
import { io } from "../app.js";
import { User } from "../models/user.model.js";

const sendNotification = async ({ senderId, receiverId, type, title, message, referenceId }) => {
    try {
        const notification = await Notification.create({
            sender: senderId,
            receiver: receiverId,
            type,
            title,
            message,
            referenceId
        });

        await notification.populate(
            "sender",
            "userName userFullName profilePic"
        );

        const uKey = unreadKey(receiverId);
        const cKey = countKey(receiverId);

        await redisClient.lPush(uKey, notification._id.toString());
        await redisClient.lTrim(uKey, 0, 49);

        await redisClient.incr(cKey);

        const thirtyDaysInSeconds = 60 * 60 * 24 * 30;
        await redisClient.expire(uKey, thirtyDaysInSeconds);
        await redisClient.expire(cKey, thirtyDaysInSeconds);

        io.to(receiverId.toString()).emit("new_notification", {
            _id: notification._id,
            sender: notification.sender,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            referenceId: notification.referenceId,
            createdAt: notification.createdAt
        });

        return notification;
    } catch (error) {
        console.error("Failed to send notification:", error);
    }
};

export { sendNotification };