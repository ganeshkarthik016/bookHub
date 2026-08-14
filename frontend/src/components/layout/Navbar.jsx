import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout } from '../../store/slices/authSlice';
import { logoutUser } from '../../services/auth.service';

function Navbar() {
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] =
        useState(false);

    const user = useSelector((state) => state.auth.user);

    const notifications = useSelector(
        (state) => state.notifications.notifications
    );

    const unreadCount = useSelector(
        (state) => state.notifications.unreadCount
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                    'Logout failed'
            );
        } finally {
            dispatch(logout());
            navigate('/login');
        }
    };

    return (
        <header className="h-16 border-b bg-white">
            <div className="flex h-full items-center px-6">
                <div className="text-xl font-bold">
                    BookHub
                </div>

                <div className="ml-10 flex-1">
                    <input
                        type="text"
                        placeholder="Search notes, playlists and users..."
                        className="w-full max-w-xl rounded-lg border px-4 py-2 outline-none focus:border-black"
                    />
                </div>

                <div className="ml-auto flex items-center gap-3">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setNotificationOpen(
                                    !notificationOpen
                                )
                            }
                            className="relative rounded-lg p-2 hover:bg-gray-100"
                        >
                            🔔

                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                                    {unreadCount > 99
                                        ? '99+'
                                        : unreadCount}
                                </span>
                            )}
                        </button>

                        {notificationOpen && (
                            <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border bg-white shadow-lg">
                                <div className="flex items-center justify-between border-b p-4">
                                    <h3 className="font-semibold">
                                        Notifications
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                '/notifications'
                                            )
                                        }
                                        className="text-sm hover:underline"
                                    >
                                        View all
                                    </button>
                                </div>

                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length ===
                                    0 ? (
                                        <p className="p-6 text-center text-sm text-gray-500">
                                            No notifications
                                        </p>
                                    ) : (
                                        notifications
                                            .slice(0, 10)
                                            .map(
                                                (
                                                    notification
                                                ) => (
                                                    <div
                                                        key={
                                                            notification._id
                                                        }
                                                        className={`border-b p-3 ${
                                                            notification.isRead
                                                                ? 'bg-white'
                                                                : 'bg-gray-50'
                                                        }`}
                                                    >
                                                        <p className="text-sm font-medium">
                                                            {
                                                                notification.title
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>
                                                    </div>
                                                )
                                            )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setProfileOpen(!profileOpen)
                            }
                            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
                        >
                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-200 font-semibold">
                                {user?.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    user?.userName
                                        ?.charAt(0)
                                        ?.toUpperCase()
                                )}
                            </div>

                            <span className="hidden text-sm font-medium md:block">
                                {user?.userName}
                            </span>
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-white p-2 shadow-lg">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileOpen(
                                            false
                                        );
                                        navigate(
                                            '/profile'
                                        );
                                    }}
                                    className="w-full rounded-md px-3 py-2 text-left hover:bg-gray-100"
                                >
                                    Profile
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full rounded-md px-3 py-2 text-left text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;