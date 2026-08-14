import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from '../services/notification.service';

import {
    notificationsStart,
    notificationsSuccess,
    notificationsFailure,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
} from '../store/slices/notificationSlice';

function Notifications() {
    const dispatch = useDispatch();

    const {
        notifications,
        loading,
    } = useSelector((state) => state.notifications);

    useEffect(() => {
        const loadNotifications = async () => {
            dispatch(notificationsStart());

            try {
                const response =
                    await getNotifications();

                dispatch(
                    notificationsSuccess(
                        response.data.data
                    )
                );
            } catch (error) {
                dispatch(notificationsFailure());

                console.error(
                    error.response?.data?.message ||
                        'Failed to load notifications'
                );
            }
        };

        loadNotifications();
    }, [dispatch]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(
                notificationId
            );

            dispatch(
                markNotificationRead(notificationId)
            );
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                    'Failed to mark notification as read'
            );
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();

            dispatch(markAllNotificationsRead());
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                    'Failed to mark notifications as read'
            );
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await deleteNotification(notificationId);

            dispatch(
                removeNotification(notificationId)
            );
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                    'Failed to delete notification'
            );
        }
    };

    if (loading) {
        return <p>Loading notifications...</p>;
    }

    const hasUnread = notifications.some(
        (notification) => !notification.isRead
    );

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Notifications
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Your recent activity and updates.
                    </p>
                </div>

                {hasUnread && (
                    <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="text-sm font-medium hover:underline"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="rounded-lg border p-10 text-center">
                    <p className="text-gray-500">
                        No notifications yet.
                    </p>
                </div>
            ) : (
                <div className="divide-y rounded-lg border">
                    {notifications.map(
                        (notification) => (
                            <div
                                key={
                                    notification._id
                                }
                                className={`flex items-start gap-4 p-4 ${
                                    notification.isRead
                                        ? 'bg-white'
                                        : 'bg-gray-50'
                                }`}
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 font-semibold">
                                    {notification.sender
                                        ?.profilePic ? (
                                        <img
                                            src={
                                                notification
                                                    .sender
                                                    .profilePic
                                            }
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        notification.sender?.userName
                                            ?.charAt(
                                                0
                                            )
                                            ?.toUpperCase()
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="font-medium">
                                        {
                                            notification.title
                                        }
                                    </p>

                                    <p className="mt-1 text-sm text-gray-600">
                                        {
                                            notification.message
                                        }
                                    </p>

                                    {notification.sender && (
                                        <p className="mt-1 text-xs text-gray-400">
                                            by{' '}
                                            {
                                                notification
                                                    .sender
                                                    .userName
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="flex shrink-0 items-center gap-3">
                                    {!notification.isRead && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleMarkAsRead(
                                                    notification._id
                                                )
                                            }
                                            className="text-sm text-gray-600 hover:text-black"
                                        >
                                            Mark as read
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                notification._id
                                            )
                                        }
                                        className="text-lg text-gray-400 hover:text-red-600"
                                        title="Delete notification"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default Notifications;