import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2, Lock, Globe, UserPlus, Users, Trash2, Edit, ChevronUp, ChevronDown, LogOut } from "lucide-react";
import { getPlaylist, getPlaylistItems, deletePlaylist, toggleNoteInPlaylist, editPlaylist, editPlaylistItemOrder, getPlaylistMembers, leavePlaylist } from "../services/playlist.service";
import { NoteCard, EmptyState, Button, SharePlaylistModal, ManageMembersModal } from "../components";

export default function PlaylistDetails() {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [playlist, setPlaylist] = useState(null);
    const [items, setItems] = useState([]);
    const [memberRole, setMemberRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [draft, setDraft] = useState({ name: "", shortNotes: "", isPrivate: false });

    useEffect(() => {
        const load = async () => {
            setIsLoading(true); setError("");
            try {
                const [data, itemData, members] = await Promise.all([getPlaylist(playlistId), getPlaylistItems(playlistId), getPlaylistMembers(playlistId)]);
                setPlaylist(data); setItems(itemData || []);
                setDraft({ name: data.name, shortNotes: data.shortNotes || "", isPrivate: data.isPrivate });
                setMemberRole(members?.find((member) => member.user?._id === currentUser?._id)?.role || null);
            } catch (err) { setError(err.message || "Failed to load playlist."); }
            finally { setIsLoading(false); }
        };
        load();
    }, [playlistId, currentUser?._id]);

    const removeNote = async (noteId) => {
        if (!window.confirm("Remove this note from the playlist?")) return;
        try { await toggleNoteInPlaylist(playlistId, noteId); setItems((current) => current.filter((item) => item.note._id !== noteId)); }
        catch (err) { setError(err.message || "Failed to remove note."); }
    };
    const moveNote = async (index, direction) => {
        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= items.length) return;
        const previous = items, next = [...items];
        [next[index], next[nextIndex]] = [next[nextIndex], next[index]]; setItems(next);
        try { await editPlaylistItemOrder(playlistId, next.map((item, order) => ({ _id: item._id, order: order + 1 }))); }
        catch (err) { setItems(previous); setError(err.message || "Could not save the new order."); }
    };
    const savePlaylist = async (event) => {
        event.preventDefault();
        if (!draft.name.trim()) return setError("Playlist name is required.");
        setIsSaving(true); setError("");
        try { setPlaylist(await editPlaylist(playlistId, draft)); setIsEditing(false); }
        catch (err) { setError(err.message || "Failed to update playlist."); }
        finally { setIsSaving(false); }
    };
    const leave = async () => {
        if (!window.confirm("Leave this shared playlist?")) return;
        try { await leavePlaylist(playlistId); navigate("/playlists"); }
        catch (err) { setError(err.message || "Failed to leave playlist."); }
    };
    const deleteCurrent = async () => {
        if (!window.confirm("Delete this playlist and all its items? This cannot be undone.")) return;
        try { await deletePlaylist(playlistId); navigate("/playlists"); }
        catch (err) { setError(err.message || "Failed to delete playlist."); }
    };

    if (isLoading) return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>;
    if (error || !playlist) return <div className="mt-10"><EmptyState title="Playlist Not Found" description={error || "This playlist may be private or deleted."} /></div>;
    const isOwner = currentUser?._id === playlist.owner?._id;
    const canEditItems = isOwner || memberRole === "EDITOR";

    return <div className="mx-auto w-full max-w-5xl pb-12">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"><div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 sm:h-32" /><div className="p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            {isEditing ? <form onSubmit={savePlaylist} className="w-full max-w-2xl space-y-3"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xl font-bold" /><textarea value={draft.shortNotes} onChange={(e) => setDraft({ ...draft, shortNotes: e.target.value })} rows="3" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /><label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={draft.isPrivate} onChange={(e) => setDraft({ ...draft, isPrivate: e.target.checked })} /> Make playlist private</label><div className="flex gap-2"><Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button><Button type="button" bgColor="bg-gray-100" textColor="text-gray-700" onClick={() => setIsEditing(false)}>Cancel</Button></div></form> : <div><div className="flex items-center gap-3"><h1 className="text-3xl font-bold text-gray-900">{playlist.name}</h1>{playlist.isPrivate ? <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600"><Lock className="h-3 w-3" /> Private</span> : <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600"><Globe className="h-3 w-3" /> Public</span>}</div>{playlist.shortNotes && <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm text-gray-600">{playlist.shortNotes}</p>}<div className="mt-4 text-sm text-gray-500">Created by <Link to={`/profile/${playlist.owner?.userName}`} className="font-semibold text-gray-900 hover:text-blue-600">@{playlist.owner?.userName}</Link></div></div>}
            <div className="flex flex-wrap items-center gap-2">{isOwner && <><Button bgColor="bg-blue-50 hover:bg-blue-100" textColor="text-blue-600" onClick={() => setIsShareModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm"><UserPlus className="h-4 w-4" /> Share</Button><Button bgColor="bg-gray-100 hover:bg-gray-200" textColor="text-gray-700" onClick={() => setIsManageModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm"><Users className="h-4 w-4" /> Members</Button><Button bgColor="bg-gray-100 hover:bg-gray-200" textColor="text-gray-700" onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm"><Edit className="h-4 w-4" /> Edit</Button><button onClick={deleteCurrent} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-5 w-5" /></button></>}{!isOwner && memberRole && <Button bgColor="bg-gray-100 hover:bg-gray-200" textColor="text-gray-700" onClick={leave} className="flex items-center gap-2 px-3 py-1.5 text-sm"><LogOut className="h-4 w-4" /> Leave</Button>}</div>
        </div></div></div>
        <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold text-gray-900">Notes in this Playlist</h2><span className="text-sm font-medium text-gray-500">{items.length} items</span></div>
        {items.length === 0 ? <EmptyState title="Playlist is Empty" description="No notes have been added to this playlist yet." /> : <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <div key={item._id} className="group relative"><NoteCard note={item.note} />{canEditItems && <><button onClick={() => removeNote(item.note._id)} className="absolute -right-2 -top-2 z-10 hidden rounded-full bg-red-100 p-1.5 text-red-600 shadow-sm hover:bg-red-500 hover:text-white group-hover:block"><Trash2 className="h-4 w-4" /></button><div className="absolute bottom-2 right-2 z-10 hidden flex-col rounded bg-white shadow group-hover:flex"><button onClick={() => moveNote(index, -1)} disabled={index === 0} className="p-1 text-gray-600 disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button><button onClick={() => moveNote(index, 1)} disabled={index === items.length - 1} className="p-1 text-gray-600 disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button></div></>}</div>)}</div>}
        <SharePlaylistModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} playlistId={playlistId} /><ManageMembersModal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} playlistId={playlistId} />
    </div>;
}
