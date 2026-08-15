import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const formatTime = (value) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Just now";

function Home() {
    const user = useSelector((state) => state.auth.user);
    const storedNotifications = useSelector((state) => state.notifications.notifications);
    const notifications = Array.isArray(storedNotifications) ? storedNotifications : [];
    return <div className="mx-auto max-w-5xl space-y-10">
        <section className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div><p className="text-sm font-medium text-slate-500">Your study space</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Welcome back, {user?.userFullName || user?.userName}</h1></div>
            <Link to="/notes" className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">Upload notes</Link>
        </section>
        <section><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Recent activity</h2><p className="text-sm text-slate-500">Updates from your BookHub network.</p></div><Link to="/notifications" className="text-sm font-medium text-slate-700 hover:underline">View inbox</Link></div>
            {notifications.length === 0 ? <div className="border-y border-slate-200 py-10 text-sm text-slate-500">No activity yet. New likes, comments, follows, and playlist updates will appear here.</div> : <div className="divide-y divide-slate-200 border-y border-slate-200">{notifications.slice(0, 8).map((notification) => <article key={notification._id} className={`flex gap-3 py-4 ${notification.isRead ? "" : "bg-white"}`}><span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${notification.isRead ? "bg-transparent" : "bg-sky-500"}`} /><div><p className="text-sm font-medium">{notification.title}</p><p className="mt-1 text-sm text-slate-600">{notification.message}</p><time className="mt-1 block text-xs text-slate-400">{formatTime(notification.createdAt)}</time></div></article>)}</div>}
        </section>
    </div>;
}
export default Home;
