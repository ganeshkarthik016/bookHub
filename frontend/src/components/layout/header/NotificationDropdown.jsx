import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, CheckCheck } from "lucide-react";
import { useSocket } from "../../../context/SocketContext";
import { 
    getUnreadNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    deleteNotification 
} from "../../../services/notification.service";
import {
    setNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
    addNotification
} from "../../../store/slices/notificationSlice";
import NotificationCard from "../../cards/NotificationCard";

export default function NotificationDropdown() {
    const dispatch = useDispatch();
    const { socket } = useSocket();
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (newNotification) => {
            dispatch(addNotification(newNotification));
        };

        socket.on("new_notification", handleNewNotification);

        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [socket, dispatch]);

    useEffect(() => {
        const fetchInitialNotifications = async () => {
            try {
                const data = await getUnreadNotifications(1, 20);
                if (data) dispatch(setNotifications(data));
            } catch (error) {
                console.error("Failed to fetch notifications");
            }
        };
        fetchInitialNotifications();
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        dispatch(markNotificationRead(notificationId));
        try {
            await markNotificationAsRead(notificationId);
        } catch (error) {
            console.error("Failed to mark as read");
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;
        dispatch(markAllNotificationsRead());
        try {
            await markAllNotificationsAsRead();
        } catch (error) {
            console.error("Failed to mark all as read");
        }
    };

    const handleDelete = async (notificationId) => {
        dispatch(removeNotification(notificationId));
        try {
            await deleteNotification(notificationId);
        } catch (error) {
            console.error("Failed to delete notification");
        }
    };

    return (
        <div className="relative mr-2 flex items-center" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <button 
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                            className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                        >
                            <CheckCheck className="mr-1 h-3 w-3" />
                            Mark all read
                        </button>
                    </div>

                    {/* Dropdown Body */}
                    <div className="max-h-[60vh] overflow-y-auto p-2">
                        {isLoading ? (
                            <div className="py-8 text-center text-sm text-gray-500">Loading...</div>
                        ) : notifications.length > 0 ? (
                            <div className="flex flex-col gap-1">
                                {notifications.map((notification) => (
                                    <NotificationCard 
                                        key={notification._id} 
                                        notification={notification} 
                                        onMarkAsRead={handleMarkAsRead}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-sm text-gray-500">
                                You're all caught up!
                            </div>
                        )}
                    </div>
                    
                    {/* Footer link to full Inbox */}
                    <div className="border-t border-gray-100 bg-gray-50 p-2 text-center">
                        <a href="/inbox" className="text-xs font-semibold text-blue-600 hover:underline">
                            View all in Inbox
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}