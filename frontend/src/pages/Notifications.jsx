import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    notificationsStart,
    notificationsSuccess,
    notificationsFailure,
    setUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
} from "../store/slices/notificationSlice";
import {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
} from "../services/notification.service";

function Notifications() {
    const dispatch = useDispatch();
    const notifications = useSelector(
        (state) => state.notifications.notifications
    );
    const unreadCount = useSelector(
        (state) => state.notifications.unreadCount
    );
    const loading = useSelector(
        (state) => state.notifications.loading
    );

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    const fetchNotifications = async (pageNum = 1) => {
        dispatch(notificationsStart());
        try {
            const response = await getNotifications(pageNum, 20);
            dispatch(
                notificationsSuccess(response.data || [])
            );
            setPage(pageNum);
            setHasMore(
                (response.data || []).length === 20
            );
        } catch (error) {
            console.error(
                "Failed to fetch notifications:",
                error
            );
            dispatch(notificationsFailure());
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await getUnreadCount();
            dispatch(setUnreadCount(response.data || 0));
        } catch (error) {
            console.error(
                "Failed to fetch unread count:",
                error
            );
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        setActionLoading((prev) => ({
            ...prev,
            [notificationId]: true,
        }));
        try {
            await markNotificationAsRead(notificationId);
            dispatch(markNotificationRead(notificationId));
            fetchUnreadCount();
        } catch (error) {
            console.error(
                "Failed to mark as read:",
                error
            );
        } finally {
            setActionLoading((prev) => ({
                ...prev,
                [notificationId]: false,
            }));
        }
    };

    const handleMarkAllAsRead = async () => {
        setActionLoading((prev) => ({
            ...prev,
            markAll: true,
        }));
        try {
            await markAllNotificationsAsRead();
            dispatch(markAllNotificationsRead());
            fetchUnreadCount();
        } catch (error) {
            console.error(
                "Failed to mark all as read:",
                error
            );
        } finally {
            setActionLoading((prev) => ({
                ...prev,
                markAll: false,
            }));
        }
    };

    const handleDelete = async (notificationId) => {
        setActionLoading((prev) => ({
            ...prev,
            [notificationId]: true,
        }));
        try {
            await deleteNotification(notificationId);
            dispatch(removeNotification(notificationId));
        } catch (error) {
            console.error(
                "Failed to delete notification:",
                error
            );
        } finally {
            setActionLoading((prev) => ({
                ...prev,
                [notificationId]: false,
            }));
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Inbox
                </h1>
                <p className="mt-1 text-gray-500">
                    {unreadCount} unread
                </p>
            </div>

            {unreadCount > 0 && (
                <button
                    onClick={handleMarkAllAsRead}
                    disabled={actionLoading.markAll}
                    className="mb-4 text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                    Mark all as read
                </button>
            )}

            {loading && notifications.length === 0 ? (
                <div className="text-center text-gray-500">
                    Loading...
                </div>
            ) : notifications.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                    <p className="text-gray-600">
                        No notifications yet
                    </p>
                </div>
            ) : (
                <div className="space-y-2 border rounded-lg overflow-hidden">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`border-b last:border-b-0 p-4 flex items-start justify-between gap-4 ${
                                notification.isRead
                                    ? "bg-white"
                                    : "bg-blue-50"
                            }`}
                        >
                            <div className="flex-1 min-w-0">
                                <p
                                    className={`text-sm font-medium ${
                                        notification.isRead
                                            ? "text-gray-700"
                                            : "text-gray-900"
                                    }`}
                                >
                                    {notification.title}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                    {notification.message}
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                    {
                                        new Date(
                                            notification.createdAt
                                        ).toLocaleDateString()
                                    }
                                </p>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                {!notification.isRead && (
                                    <button
                                        onClick={() =>
                                            handleMarkAsRead(
                                                notification._id
                                            )
                                        }
                                        disabled={
                                            actionLoading[
                                                notification
                                                    ._id
                                            ]
                                        }
                                        className="text-xs text-blue-600 hover:underline disabled:opacity-50"
                                    >
                                        Mark read
                                    </button>
                                )}

                                <button
                                    onClick={() =>
                                        handleDelete(
                                            notification._id
                                        )
                                    }
                                    disabled={
                                        actionLoading[
                                            notification._id
                                        ]
                                    }
                                    className="text-xs text-red-600 hover:underline disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {hasMore && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() =>
                            fetchNotifications(page + 1)
                        }
                        disabled={loading}
                        className="rounded-lg border px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Load more
                    </button>
                </div>
            )}
        </div>
    );
}

export default Notifications;