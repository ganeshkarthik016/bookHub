import { useState } from 'react';
import { useSelector } from 'react-redux';

function Navbar() {
    const [profileOpen, setProfileOpen] = useState(false);

    const user = useSelector((state) => state.auth.user);

    return (
        <header className="h-16 border-b bg-white">
            <div className="flex h-full items-center px-6">
                {/* Logo */}
                <div className="text-xl font-bold">
                    BookHub
                </div>

                {/* Search */}
                <div className="ml-10 flex-1">
                    <input
                        type="text"
                        placeholder="Search notes, playlists and users..."
                        className="w-full max-w-xl rounded-lg border px-4 py-2 outline-none focus:border-black"
                    />
                </div>

                {/* Right side */}
                <div className="ml-auto flex items-center gap-4">
                    {/* Notification */}
                    <button
                        type="button"
                        className="relative rounded-lg p-2 hover:bg-gray-100"
                    >
                        🔔
                    </button>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 font-semibold">
                                {user?.userName?.charAt(0)?.toUpperCase()}
                            </div>

                            <span className="hidden md:block text-sm font-medium">
                                {user?.userName}
                            </span>
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-white p-2 shadow-lg">
                                <button
                                    type="button"
                                    className="w-full rounded-md px-3 py-2 text-left hover:bg-gray-100"
                                >
                                    Profile
                                </button>

                                <button
                                    type="button"
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