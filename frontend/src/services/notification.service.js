import api from "./api";

export const getUnreadCount = async () => {
    const response = await api.get("/notifications/count");
    return response.data;
};

export const getUnreadNotifications = async () => {
    const response = await api.get("/notifications/unread");
    return response.data;
};

export const getNotifications = async (page = 1, limit = 20) => {
    const response = await api.get("/notifications", {
        params: { page, limit },
    });
    return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
};

export const markAllNotificationsAsRead = async () => {
    const response = await api.patch("/notifications/read-all");
    return response.data;
};

export const deleteNotification = async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
};