import { Notification } from "../models/notification.model.js";
import { redisClient, countKey, unreadKey } from "../utils/redis.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";


const getUnreadCount = asyncHandler(async (req, res) => {
    const cKey = countKey(req.user._id);
    const count = await redisClient.get(cKey);

    return res.status(200).json(
        new apiResponse(200, { count: parseInt(count || 0) }, "Unread count fetched")
    );
});

const getNotifications = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const notifications = await Notification.find({ receiver: req.user._id })
        .populate("sender", "userName profilePic")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate(
            "sender",
            "userName userFullName profilePic"
        );

    return res.status(200).json(
        new apiResponse(200, notifications, "Notifications fetched successfully")
    );
});

// Mark a single notification as read
const markAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
        _id: notificationId,
        receiver: req.user._id
    });

    if (!notification) {
        throw new apiError(404, "Notification not found");
    }

    if (!notification.isRead) {
        // Update Mongo
        notification.isRead = true;
        await notification.save({ validateBeforeSave: false });

        // Update Redis Cache
        const uKey = unreadKey(req.user._id);
        const cKey = countKey(req.user._id);

        // Remove this specific ID from the Redis unread list
        await redisClient.lRem(uKey, 0, notificationId);

        // Decrement the unread count safely
        const currentCount = await redisClient.get(cKey);
        if (currentCount && parseInt(currentCount) > 0) {
            await redisClient.decr(cKey);
        }
    }

    return res.status(200).json(
        new apiResponse(200, notification, "Notification marked as read")
    );
});

// Nuke all unreads at once
const markAllAsRead = asyncHandler(async (req, res) => {
    // Update Mongo
    await Notification.updateMany(
        { receiver: req.user._id, isRead: false },
        { $set: { isRead: true } }
    );

    // Completely clear Redis for this user
    await redisClient.del(unreadKey(req.user._id));
    await redisClient.set(countKey(req.user._id), 0);

    return res.status(200).json(
        new apiResponse(200, {}, "All notifications marked as read")
    );
});

const deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
        _id: notificationId,
        receiver: req.user._id
    });

    if (!notification) {
        throw new apiError(404, "Notification not found");
    }

    if (!notification.isRead) {
        const uKey = unreadKey(req.user._id);
        const cKey = countKey(req.user._id);

        const removedCount = await redisClient.lRem(uKey, 0, notificationId);

        if (removedCount > 0) {
            const currentCount = await redisClient.get(cKey);
            if (currentCount && parseInt(currentCount) > 0) {
                await redisClient.decr(cKey);
            }
        }
    }

    // Delete it permanently from MongoDB
    await Notification.deleteOne({
        _id: notificationId,
        receiver: req.user._id
    });

    return res.status(200).json(
        new apiResponse(200, {}, "Notification deleted successfully")
    );
});

export {
    getUnreadCount,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};