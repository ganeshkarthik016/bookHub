import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
    { label: "Home", to: "/", icon: "⌂" },
    { label: "Notes", to: "/notes", icon: "▤" },
    { label: "Playlists", to: "/playlists", icon: "☷" },
    { label: "Inbox", to: "/notifications", icon: "✉" },
];

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <aside className={`shrink-0 border-r border-slate-200 bg-slate-50 transition-[width] duration-200 ${collapsed ? "w-16" : "w-56"}`}>
            <div className="flex h-14 items-center border-b border-slate-200 px-3">
                {!collapsed && <span className="text-sm font-semibold text-slate-600">Navigation</span>}
                <button type="button" title={collapsed ? "Expand navigation" : "Collapse navigation"} onClick={() => setCollapsed((value) => !value)} className="ml-auto grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:bg-slate-200" aria-label="Toggle navigation">
                    <span className="leading-3">☰</span>
                </button>
            </div>
            <nav className="space-y-1 p-2">
                {links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === "/"} title={collapsed ? link.label : undefined} className={({ isActive }) => `flex items-center rounded-md px-3 py-2.5 text-sm transition-colors ${collapsed ? "justify-center" : "gap-3"} ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200 hover:text-slate-950"}`}>
                    <span className="text-base" aria-hidden="true">{link.icon}</span>{!collapsed && <span>{link.label}</span>}
                </NavLink>)}
            </nav>
        </aside>
    );
}

export default Sidebar;
