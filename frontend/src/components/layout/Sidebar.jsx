import { NavLink } from "react-router-dom";

function Sidebar() {
    const links = [
        {
            name: "Home",
            path: "/",
        },
        {
            name: "Notes",
            path: "/notes",
        },
        {
            name: "Playlists",
            path: "/playlists",
        },
        {
            name: "Notifications",
            path: "/notifications",
        },
    ];

    return (
        <aside className="w-60 min-h-screen border-r p-4">
            <h2 className="text-xl font-bold mb-6">
                BookHub
            </h2>

            <nav className="space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                            `block rounded-lg px-4 py-2 ${
                                isActive
                                    ? "bg-black text-white"
                                    : "hover:bg-gray-100"
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;