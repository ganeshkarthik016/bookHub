import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const links = [
        {
            name: 'Home',
            path: '/',
            icon: '⌂',
        },
        {
            name: 'Notes',
            path: '/notes',
            icon: '📝',
        },
        {
            name: 'Playlists',
            path: '/playlists',
            icon: '📚',
        },
        {
            name: 'Notifications',
            path: '/notifications',
            icon: '🔔',
        },
    ];

    return (
        <aside
            className={`shrink-0 border-r bg-white transition-all duration-200 ${
                collapsed ? 'w-16' : 'w-56'
            }`}
        >
            <div className="flex h-14 items-center justify-between border-b px-3">
                {!collapsed && (
                    <h2 className="text-lg font-bold">
                        BookHub
                    </h2>
                )}

                <button
                    type="button"
                    onClick={() =>
                        setCollapsed(!collapsed)
                    }
                    className="rounded-md px-2 py-1 text-xl hover:bg-gray-100"
                >
                    ☰
                </button>
            </div>

            <nav className="space-y-1 p-3">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        title={
                            collapsed
                                ? link.name
                                : undefined
                        }
                        className={({ isActive }) =>
                            `flex items-center rounded-lg px-3 py-2.5 ${
                                collapsed
                                    ? 'justify-center'
                                    : 'gap-3'
                            } ${
                                isActive
                                    ? 'bg-black text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span>{link.icon}</span>

                        {!collapsed && (
                            <span className="text-sm">
                                {link.name}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;