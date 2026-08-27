import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Home, FileText, ListMusic, Inbox, X, PenLine } from "lucide-react";
import { toggleSidebar } from "../../../store/slices/uiSlice.js";

export default function Sidebar() {
    const dispatch = useDispatch();
    const { isSidebarOpen } = useSelector((state) => state.ui);

    const navItems = [
        { name: "Home", path: "/", icon: Home },
        { name: "Notes", path: "/notes", icon: FileText },
        { name: "Written Notes", path: "/written-notes", icon: PenLine },
        { name: "Playlists", path: "/playlists", icon: ListMusic },
        { name: "Inbox", path: "/inbox", icon: Inbox },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => dispatch(toggleSidebar())}
                />
            )}

            {/* Sidebar Content */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-16 items-center justify-between px-4 lg:hidden border-b border-gray-200">
                    <span className="text-xl font-bold text-blue-600">Menu</span>
                    <button onClick={() => dispatch(toggleSidebar())}>
                        <X className="h-6 w-6 text-gray-700" />
                    </button>
                </div>

                <nav className="space-y-1 p-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => dispatch(toggleSidebar())} // Auto-close on mobile
                            className={({ isActive }) =>
                                `flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
}
