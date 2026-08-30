import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCheck, Loader2, Bell } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "../services/notification.service";
import { markNotificationRead, markAllNotificationsRead, removeNotification, addNotification } from "../store/slices/notificationSlice";
import { NotificationCard, EmptyState } from "../components";

export default function Inbox() {
    const dispatch = useDispatch();
    const { socket } = useSocket();
    const { unreadCount } = useSelector((state) => state.notifications);
    
    const [notifications, setLocalNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (newNotification) => {

            dispatch(addNotification(newNotification));
            setLocalNotifications((prev) => [newNotification, ...prev]);
        };
        socket.on("new_notification", handleNewNotification);

        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [socket, dispatch]);

    useEffect(() => {
        const fetchInbox = async () => {
            setIsLoading(true);
            try {
                const data = await getNotifications(1, 20);
                if (data && Array.isArray(data)) {
                    setLocalNotifications(data);
                    setHasMore(data.length === 20); 
                }
            } catch {
                console.error("Failed to load inbox");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInbox();
    }, []);

    const handleMarkAsRead = async (id) => {
        // Optimistic UI updates
        setLocalNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        dispatch(markNotificationRead(id)); // Keep header dropdown in sync
        try {
            await markNotificationAsRead(id);
        } catch {
            console.error("Error marking read");
        }
    };

    const handleMarkAllAsRead = async () => {
        setLocalNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        dispatch(markAllNotificationsRead());
        try {
            await markAllNotificationsAsRead();
        } catch {
            console.error("Error marking all read");
        }
    };

    const handleDelete = async (id) => {
        setLocalNotifications(prev => prev.filter(n => n._id !== id));
        dispatch(removeNotification(id));
        try {
            await deleteNotification(id);
        } catch {
            console.error("Error deleting notification");
        }
    };

    const loadMore = async () => {
        const nextPage = page + 1;
        try {
            const data = await getNotifications(nextPage, 20);
            if (data && Array.isArray(data)) {
                setLocalNotifications(prev => [...prev, ...data]);
                setPage(nextPage);
                setHasMore(data.length === 20);
            }
        } catch {
            console.error("Error loading more");
        }
    };

    return (
        <div className="mx-auto w-full max-w-3xl pb-12">
            <div className="mb-6 flex items-end justify-between border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your notifications and alerts.</p>
                </div>
                
                <button 
                    bgColor="bg-blue-50" 
                    textColor="text-blue-600 hover:bg-blue-100"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm"
                >
                    <CheckCheck className="h-4 w-4" />
                    Mark all as read
                </button>
            </div>

            {isLoading ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : notifications.length === 0 ? (
                <EmptyState 
                    icon={Bell}
                    title="All caught up!" 
                    description="You don't have any notifications right now." 
                />
            ) : (
                <div className="flex flex-col gap-3">
                    {notifications.map((notif) => (
                        <NotificationCard 
                            key={notif._id} 
                            notification={notif} 
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDelete}
                        />
                    ))}

                    {hasMore && (
                        <button
                            onClick={loadMore}
                            className="mt-6 rounded-lg border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Load Older Notifications
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}