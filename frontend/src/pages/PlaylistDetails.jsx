import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2, Lock, Globe, UserPlus, Users, Trash2, Edit } from "lucide-react";
import { getPlaylist, getPlaylistItems, deletePlaylist, toggleNoteInPlaylist } from "../services/playlist.service";
import { NoteCard, EmptyState, Button, SharePlaylistModal, ManageMembersModal } from "../components";

export default function PlaylistDetails() {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);

    const [playlist, setPlaylist] = useState(null);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Local state for our specific Playlist Modals
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    useEffect(() => {
        const fetchPlaylistData = async () => {
            setIsLoading(true);
            setError("");
            try {
                // Fetch the playlist metadata and its actual notes concurrently
                const [playlistData, itemsData] = await Promise.all([
                    getPlaylist(playlistId),
                    getPlaylistItems(playlistId)
                ]);

                if (playlistData) setPlaylist(playlistData);
                if (itemsData) setItems(itemsData);
            } catch (err) {
                setError(err.message || "Failed to load playlist.");
            } finally {
                setIsLoading(false);
            }
        };

        if (playlistId) fetchPlaylistData();
    }, [playlistId]);

    const handleDeletePlaylist = async () => {
        if (!window.confirm("Are you sure you want to delete this playlist? This cannot be undone.")) return;
        
        try {
            await deletePlaylist(playlistId);
            navigate(`/profile/${currentUser.userName}`);
        } catch (err) {
            alert("Failed to delete playlist.");
        }
    };

    const handleRemoveNote = async (noteId) => {
        if (!window.confirm("Remove this note from the playlist?")) return;

        try {
            await toggleNoteInPlaylist(playlistId, noteId);
            // Optimistically remove it from the UI
            setItems((prev) => prev.filter((item) => item.note._id !== noteId));
        } catch (err) {
            alert("Failed to remove note.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div className="mt-10">
                <EmptyState title="Playlist Not Found" description={error || "This playlist may be private or deleted."} />
            </div>
        );
    }

    const isOwner = currentUser?._id === playlist.owner?._id;

    return (
        <div className="mx-auto w-full max-w-5xl pb-12">
            
            {/* Playlist Header */}
            <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="h-24 w-full bg-gradient-to-r from-blue-600 to-indigo-600 sm:h-32"></div>
                
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900">{playlist.name}</h1>
                                {playlist.isPrivate ? (
                                    <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                                        <Lock className="h-3 w-3" /> Private
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                                        <Globe className="h-3 w-3" /> Public
                                    </span>
                                )}
                            </div>
                            
                            {playlist.shortNotes && (
                                <p className="mt-3 max-w-2xl text-sm text-gray-600 whitespace-pre-wrap">
                                    {playlist.shortNotes}
                                </p>
                            )}

                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                                <span>Created by</span>
                                <Link to={`/profile/${playlist.owner?.userName}`} className="flex items-center gap-1 font-semibold text-gray-900 hover:text-blue-600">
                                    <img 
                                        src={playlist.owner?.profilePic?.url || "https://via.placeholder.com/20"} 
                                        alt={playlist.owner?.userName}
                                        className="h-5 w-5 rounded-full object-cover"
                                    />
                                    {playlist.owner?.userName}
                                </Link>
                            </div>
                        </div>

                        {/* Owner Controls */}
                        {isOwner && (
                            <div className="flex flex-wrap items-center gap-2">
                                <Button 
                                    bgColor="bg-blue-50 hover:bg-blue-100" 
                                    textColor="text-blue-600"
                                    onClick={() => setIsShareModalOpen(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm"
                                >
                                    <UserPlus className="h-4 w-4" /> Share
                                </Button>
                                <Button 
                                    bgColor="bg-gray-100 hover:bg-gray-200" 
                                    textColor="text-gray-700"
                                    onClick={() => setIsManageModalOpen(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm"
                                >
                                    <Users className="h-4 w-4" /> Members
                                </Button>
                                <button 
                                    onClick={handleDeletePlaylist}
                                    className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition-colors"
                                    title="Delete Playlist"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Playlist Items / Notes */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Notes in this Playlist</h2>
                <span className="text-sm font-medium text-gray-500">{items.length} items</span>
            </div>

            {items.length === 0 ? (
                <EmptyState 
                    title="Playlist is Empty" 
                    description="No notes have been added to this playlist yet." 
                />
            ) : (
                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <div key={item._id} className="relative group">
                            {/* Render the NoteCard using the populated note data */}
                            <NoteCard note={item.note} />
                            
                            {/* Quick Remove Button (only for owners) */}
                            {isOwner && (
                                <button
                                    onClick={() => handleRemoveNote(item.note._id)}
                                    className="absolute -right-2 -top-2 z-10 hidden rounded-full bg-red-100 p-1.5 text-red-600 shadow-sm hover:bg-red-500 hover:text-white group-hover:block transition-colors"
                                    title="Remove from Playlist"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Mount our specific modals here so we can pass them the playlistId */}
            <SharePlaylistModal 
                isOpen={isShareModalOpen} 
                onClose={() => setIsShareModalOpen(false)} 
                playlistId={playlistId} 
            />
            <ManageMembersModal 
                isOpen={isManageModalOpen} 
                onClose={() => setIsManageModalOpen(false)} 
                playlistId={playlistId} 
            />
        </div>
    );
}