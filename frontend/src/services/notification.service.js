import api from './api';

export const getNotifications = (page = 1, limit = 20) => {
    return api.get('/notifications', {
        params: {
            page,
            limit,
        },
    });
};

export const getUnreadNotifications = (
    page = 1,
    limit = 20
) => {
    return api.get('/notifications/unread', {
        params: {
            page,
            limit,
        },
    });
};

export const getUnreadCount = () => {
    return api.get('/notifications/count');
};

export const markNotificationAsRead = (notificationId) => {
    return api.patch(
        `/notifications/${notificationId}/read`
    );
};

export const markAllNotificationsAsRead = () => {
    return api.patch('/notifications/read-all');
};

export const deleteNotification = (notificationId) => {
    return api.delete(`/notifications/${notificationId}`);
};