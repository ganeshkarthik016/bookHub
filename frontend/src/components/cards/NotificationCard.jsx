import { Link } from "react-router-dom";
import { Heart, MessageCircle, UserPlus, ListMusic, Info } from "lucide-react";

export default function NotificationCard({ notification, onMarkAsRead, onDelete }) {
    // Pick an icon and color based on the notification type
    const getIcon = () => {
        switch (notification.type) {
            case "LIKE":
                return <Heart className="h-5 w-5 text-pink-500" />;
            case "COMMENT":
                return <MessageCircle className="h-5 w-5 text-blue-500" />;
            case "FOLLOW":
                return <UserPlus className="h-5 w-5 text-green-500" />;
            case "PLAYLIST_SHARED":
            case "PLAYLIST_ROLE_UPDATED":
            case "PLAYLIST_REMOVED":
                return <ListMusic className="h-5 w-5 text-purple-500" />;
            default:
                return <Info className="h-5 w-5 text-gray-400" />;
        }
    };

    return (
        <div 
            className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 ${
                notification.isRead 
                    ? "border-gray-100 bg-white" 
                    : "border-blue-100 bg-blue-50/50 shadow-sm"
            }`}
        >
            {/* Icon / Avatar Wrapper */}
            <div className="flex flex-shrink-0 items-center justify-center rounded-full bg-white p-2 shadow-sm border border-gray-100">
                {getIcon()}
            </div>

            {/* Content */}
            <div className="flex-1">
                <p className="text-sm text-gray-800">
                    <span className="font-semibold text-gray-900">
                        {notification.sender?.userName || "Someone"}{" "}
                    </span>
                    {notification.message}
                </p>
                <span className="mt-1 block text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                </span>
            </div>

            {/* Action Buttons (Visible on Hover for a cleaner UI) */}
            <div className="flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                {!notification.isRead && (
                    <button 
                        onClick={() => onMarkAsRead(notification._id)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                        Mark Read
                    </button>
                )}
                <button 
                    onClick={() => onDelete(notification._id)}
                    className="text-xs font-medium text-red-500 hover:text-red-700"
                >
                    Delete
                </button>
            </div>
            
            {/* Unread Indicator Dot */}
            {!notification.isRead && (
                <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-blue-600"></div>
            )}
        </div>
    );
}