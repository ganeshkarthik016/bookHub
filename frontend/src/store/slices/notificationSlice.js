import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

const notificationSlice = createSlice({
    name: 'notifications',

    initialState,

    reducers: {
        notificationsStart: (state) => {
            state.loading = true;
            state.error = null;
        },

        notificationsSuccess: (state, action) => {
            state.loading = false;
            state.notifications = action.payload;
        },

        notificationsFailure: (state) => {
            state.loading = false;
            state.error = "Unable to load notifications.";
        },

        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },

        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },

        markNotificationRead: (state, action) => {
            const notification = state.notifications.find(
                (item) => item._id === action.payload
            );

            if (notification && !notification.isRead) {
                notification.isRead = true;

                if (state.unreadCount > 0) {
                    state.unreadCount -= 1;
                }
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
            const notification = state.notifications.find(
                (item) => item._id === action.payload
            );

            if (notification && !notification.isRead) {
                if (state.unreadCount > 0) {
                    state.unreadCount -= 1;
                }
            }

            state.notifications =
                state.notifications.filter(
                    (item) => item._id !== action.payload
                );
        },
    },
});

export const {
    notificationsStart,
    notificationsSuccess,
    notificationsFailure,
    setUnreadCount,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
