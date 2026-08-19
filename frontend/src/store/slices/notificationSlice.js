import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,

    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(
                (notification) => !notification.isRead
            ).length;
        },

        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);

            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },

        markNotificationRead: (state, action) => {
            const notification = state.notifications.find(
                (notification) =>
                    notification._id === action.payload
            );

            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount -= 1;
            }
        },

        markAllNotificationsRead: (state) => {
            state.notifications.forEach(
                (notification) => {
                    notification.isRead = true;
                }
            );

            state.unreadCount = 0;
        },

        removeNotification: (state, action) => {
            const notificationIndex =
                state.notifications.findIndex(
                    (notification) =>
                        notification._id === action.payload
                );

            if (notificationIndex === -1) {
                return;
            }

            const notification =
                state.notifications[notificationIndex];

            if (!notification.isRead) {
                state.unreadCount -= 1;
            }

            state.notifications.splice(notificationIndex, 1);
        },

        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },

        setNotificationLoading: (state, action) => {
            state.loading = action.payload;
        },

        appendNotifications: (state, action) => {
            state.notifications = [...state.notifications, ...action.payload];
            
            state.unreadCount = state.notifications.filter(
                (notification) => !notification.isRead
            ).length;
        },
    },
});

export const {
    setNotifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
    clearNotifications,
    setNotificationLoading,
    appendNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;