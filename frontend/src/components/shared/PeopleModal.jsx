import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Modal from "../ui/Modal";
import { getFollowers, getFollowing } from "../../services/follow.service";
import { getNoteLikes } from "../../services/like.service";

export default function PeopleModal({ isOpen, onClose, mode, userId, noteId }) {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const title = mode === "followers" ? "Followers" : mode === "following" ? "Following" : "People who liked this note";
    useEffect(() => { if (!isOpen) return; const load = async () => { setLoading(true); setError(""); try { if (mode === "followers") { const data = await getFollowers(userId); setPeople((data?.followers || []).map((item) => item.follower)); } else if (mode === "following") { const data = await getFollowing(userId); setPeople((data?.following || []).map((item) => item.following)); } else { const data = await getNoteLikes(noteId); setPeople([...(data?.following || []), ...(data?.others || [])].map((item) => item.user)); } } catch (err) { setError(err.message || "Could not load this list."); } finally { setLoading(false); } }; load(); }, [isOpen, mode, userId, noteId]);
    return <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md"><div className="max-h-80 space-y-2 overflow-y-auto">{loading ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div> : error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p> : people.length ? people.map((person) => <Link key={person?._id} to={`/profile/${person?.userName}`} onClick={onClose} className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50"><img src={person?.profilePic?.url || "https://via.placeholder.com/40"} alt="" className="h-10 w-10 rounded-full object-cover" /><div><p className="text-sm font-semibold text-gray-900">{person?.userFullName || person?.userName}</p><p className="text-xs text-gray-500">@{person?.userName}</p></div></Link>) : <p className="py-8 text-center text-sm text-gray-500">No people to show yet.</p>}</div></Modal>;
}
