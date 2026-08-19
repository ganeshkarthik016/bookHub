import api from "./api.js";

import { apiError } from "../utils/apiError.js";

const handleError = (error) => {
    throw new apiError(
        error.response?.status || 500,
        error.response?.data?.message ||
            "Something went wrong",
        error.response?.data?.errors || []
    );
};

const getUnreadCount = async () => {
    try {
        const response = await api.get(
            "/notifications/count"
        );

        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const getUnreadNotifications = async (page = 1, limit = 20) => {
    try {
        const response = await api.get(
            "/notifications/unread",
            {
                params: {
                    page,
                    limit,
                },
            }
        );

        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const getNotifications = async (page = 1, limit = 20) => {
    try {
        const response = await api.get(
            "/notifications",
            {
                params: {
                    page,
                    limit,
                },
            }
        );

        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const markNotificationAsRead = async (
    notificationId
) => {
    try {
        const response = await api.patch(
            `/notifications/${notificationId}/read`
        );

        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const markAllNotificationsAsRead = async () => {
    try {
        const response = await api.patch(
            "/notifications/read-all"
        );

        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const deleteNotification = async (
    notificationId
) => {
    try {
        const response = await api.delete(
            `/notifications/${notificationId}`
        );

        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export {
    getUnreadCount,
    getUnreadNotifications,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
};