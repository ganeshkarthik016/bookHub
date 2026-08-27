import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Loader2, Download, BookmarkPlus, Eye, Calendar, Edit, Trash2 } from "lucide-react";
import { getCurrentNote, downloadNote, updateNoteDetails, updateNoteFiles, deleteNote } from "../services/note.service";
import { openModal } from "../store/slices/uiSlice";
import { setCurrentNote } from "../store/slices/noteSlice"; 
import { LikeButton, FollowButton, CommentSection, Button, EmptyState, SaveToPlaylistModal, PeopleModal } from "../components";

export default function NoteDetails() {
    const { noteId } = useParams();
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);
    
    const [note, setNote] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState({ title: "", description: "", tags: "", isPrivate: false });
    const [pdfFile, setPdfFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [showLikes, setShowLikes] = useState(false);

    useEffect(() => {
        const fetchNote = async () => {
            setIsLoading(true);
            setError("");
            try {
                const data = await getCurrentNote(noteId);
                setNote(data);
                setEditData({ title: data.title, description: data.description || "", tags: (data.tags || []).join(", "), isPrivate: data.isPrivate });
                // Dispatch to Redux so the rest of the app knows what note we are looking at!
                dispatch(setCurrentNote(data)); 
            } catch (err) {
                setError(err.message || "Failed to load note details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (noteId) fetchNote();
    }, [noteId, dispatch]);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const data = await downloadNote(noteId);
            
            if (data?.downloadUrl) {
                // FIXED: Just open the secure URL without the fl_attachment hack
                window.open(data.downloadUrl, "_blank");
                setNote(prev => ({ ...prev, downloads: prev.downloads + 1 }));
            }
        } catch {
            console.error("Failed to download note");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();
        if (!editData.title.trim()) return setError("Note title is required.");
        setIsSaving(true);
        try {
            const updated = await updateNoteDetails(noteId, editData);
            let nextNote = { ...note, ...updated, owner: note.owner };
            if (pdfFile || coverImage) {
                const files = new FormData();
                if (pdfFile) files.append("pdf", pdfFile);
                if (coverImage) files.append("coverImage", coverImage);
                nextNote = { ...nextNote, ...(await updateNoteFiles(noteId, files)), owner: note.owner };
            }
            setNote(nextNote);
            setPdfFile(null); setCoverImage(null);
            setIsEditing(false);
        } catch (err) { setError(err.message || "Failed to update note."); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete this note? This cannot be undone.")) return;
        try { await deleteNote(noteId); window.location.assign("/notes"); }
        catch (err) { setError(err.message || "Failed to delete note."); }
    };

    if (isLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !note) {
        return (
            <div className="mt-10">
                <EmptyState 
                    title="Note Not Found" 
                    description={error || "This note might be private or deleted."} 
                />
            </div>
        );
    }

    const isOwner = currentUser?._id === note.owner?._id;

    return (
        <div className="mx-auto max-w-4xl pb-12">
            
            {/* --- Note Header Info --- */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{note.title}</h1>
                        <p className="mt-2 text-gray-600 whitespace-pre-wrap">{note.description}</p>
                    </div>

                    {/* Action Buttons: Like & Save */}
                    <div className="flex items-center gap-3 shrink-0">
                        <LikeButton 
                            noteId={note._id} 
                            initialIsLiked={note.isLiked} 
                            initialLikesCount={note.likesCount} 
                        />
                        <button type="button" onClick={() => setShowLikes(true)} className="text-xs font-medium text-gray-500 hover:text-blue-600">Liked by</button>
                        <button 
                            onClick={() => dispatch(openModal("SAVE_TO_PLAYLIST"))}
                            className="flex items-center justify-center rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
                            title="Save to Playlist"
                        >
                            <BookmarkPlus className="h-5 w-5" />
                        </button>
                        {isOwner && <><button onClick={() => setIsEditing((value) => !value)} className="flex items-center justify-center rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200" title="Edit note"><Edit className="h-5 w-5" /></button><button onClick={handleDelete} className="flex items-center justify-center rounded-full bg-red-50 p-2 text-red-600 hover:bg-red-100" title="Delete note"><Trash2 className="h-5 w-5" /></button></>}
                    </div>
                </div>

                {isEditing && <form onSubmit={handleSave} className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/40 p-4">
                    <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Title" />
                    <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows="3" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Description" />
                    <input value={editData.tags} onChange={(e) => setEditData({ ...editData, tags: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Tags separated by commas" />
                    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm text-gray-600">Replace PDF<input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} className="mt-1 block w-full text-xs" /></label><label className="text-sm text-gray-600">Replace cover image<input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="mt-1 block w-full text-xs" /></label></div>
                    <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={editData.isPrivate} onChange={(e) => setEditData({ ...editData, isPrivate: e.target.checked })} /> Make this note private</label>
                    <div className="flex gap-2"><Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save changes"}</Button><Button type="button" bgColor="bg-gray-100" textColor="text-gray-700" onClick={() => setIsEditing(false)}>Cancel</Button></div>
                </form>}

                {/* Tags */}
                {note.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {note.tags.map((tag, index) => (
                            <span key={index} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <hr className="my-2 border-gray-100" />

                {/* Author Info & Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link to={`/profile/${note.owner?.userName}`} className="shrink-0">
                            <img 
                                src={note.owner?.profilePic?.url || "https://via.placeholder.com/50"} 
                                alt={note.owner?.userName} 
                                className="h-12 w-12 rounded-full border border-gray-200 object-cover"
                            />
                        </Link>
                        <div className="flex flex-col">
                            <Link to={`/profile/${note.owner?.userName}`} className="font-bold text-gray-900 hover:underline">
                                {note.owner?.userFullName || note.owner?.userName}
                            </Link>
                            <span className="text-sm text-gray-500">@{note.owner?.userName}</span>
                        </div>
                        
                        {!isOwner && (
                            <div className="ml-2">
                                <FollowButton userId={note.owner?._id} initialIsFollowing={note.owner?.isFollowing} />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Eye className="h-4 w-4"/> {note.views} Views</span>
                        <span className="flex items-center gap-1"><Download className="h-4 w-4"/> {note.downloads} Downloads</span>
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> {new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* --- The PDF Viewer Container --- */}
            <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-900 shadow-sm">
            <iframe 
                src={note.pdf?.url ? `https://docs.google.com/viewer?url=${encodeURIComponent(note.pdf.url)}&embedded=true` : ""} 
                title={note.title}
                className="h-[70vh] w-full border-0 bg-white"
                allowFullScreen
            />
                
                <div className="flex items-center justify-between bg-gray-900 px-4 py-3 text-white">
                    <span className="text-sm font-medium">Document Preview</span>
                    <Button 
                        onClick={handleDownload} 
                        disabled={isDownloading}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                    >
                        {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* --- Interactive Sections --- */}
            <CommentSection noteId={note._id} currentUserId={currentUser?._id} />
            
            {/* Mounting the modal locally so it easily receives the note._id prop */}
            <SaveToPlaylistModal noteId={note._id} />
            <PeopleModal isOpen={showLikes} onClose={() => setShowLikes(false)} mode="likes" noteId={note._id} />

        </div>
    );
}
