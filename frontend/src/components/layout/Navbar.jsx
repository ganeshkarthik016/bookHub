import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import { logoutUser } from "../../services/auth.service";

const avatarUrl = (user) => user?.profilePic?.url || user?.profilePic;

function Navbar() {
    const [profileOpen, setProfileOpen] = useState(false);
    const [search, setSearch] = useState("");
    const { user } = useSelector((state) => state.auth);
    const unreadCount = useSelector((state) => state.notifications.unreadCount);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try { await logoutUser(); } catch { /* Clear local session even if the expired backend session rejects logout. */ }
        dispatch(logout());
        navigate("/login");
    };
    const name = user?.userFullName || user?.userName || "Account";
    const handleSearch = (event) => {
        event.preventDefault();
        const query = search.trim();
        if (query) navigate(`/notes?search=${encodeURIComponent(query)}`);
    };
    return <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-full items-center gap-4 px-4 sm:px-6">
            <Link to="/" className="shrink-0 text-lg font-bold tracking-tight text-slate-950">BookHub</Link>
            <form onSubmit={handleSearch} className="hidden max-w-xl flex-1 md:block"><label><span className="sr-only">Search notes</span><input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search public notes" className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-500" /></label></form>
            <div className="ml-auto flex items-center gap-2">
                <Link to="/notifications" title="Inbox" aria-label="Inbox" className="relative grid h-9 w-9 place-items-center rounded-md text-lg text-slate-600 hover:bg-slate-100 hover:text-slate-950">⌑
                    {unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-600 px-1 text-center text-[10px] font-semibold leading-5 text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
                </Link>
                <div className="relative">
                    <button type="button" onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 rounded-md p-1.5 hover:bg-slate-100" aria-expanded={profileOpen}>
                        <span className="grid h-8 w-8 overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-600 place-items-center">{avatarUrl(user) ? <img src={avatarUrl(user)} alt="" className="h-full w-full object-cover" /> : name.charAt(0)}</span>
                        <span className="hidden max-w-32 truncate text-sm font-medium text-slate-700 sm:block">{name}</span>
                    </button>
                    {profileOpen && <div className="absolute right-0 top-11 w-40 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                        <button type="button" onClick={() => { setProfileOpen(false); navigate("/profile"); }} className="w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-100">Profile</button>
                        <button type="button" onClick={handleLogout} className="w-full rounded px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50">Logout</button>
                    </div>}
                </div>
            </div>
        </div>
    </header>;
}

export default Navbar;
