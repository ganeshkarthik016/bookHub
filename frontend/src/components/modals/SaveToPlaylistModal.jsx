import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckSquare, Square, Plus, Loader2 } from "lucide-react";
import { closeModal } from "../../store/slices/uiSlice";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { 
    getUserPlaylistsWithNoteStatus, 
    toggleNoteInPlaylist, 
    createPlaylist,
    getMyEditorPlaylists,
    isNotePresentInPlaylist
} from "../../services/playlist.service";

export default function SaveToPlaylistModal({ noteId }) {
    const dispatch = useDispatch();
    const { activeModal } = useSelector((state) => state.ui);
    const isOpen = activeModal === "SAVE_TO_PLAYLIST";

    const [playlists, setPlaylists] = useState([]);
    const [editorPlaylists, setEditorPlaylists] = useState([]);
    const [activeTab, setActiveTab] = useState("owned");
    const [isLoading, setIsLoading] = useState(true);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen || !noteId) return;

        const fetchStatuses = async () => {
            setIsLoading(true);
            setError("");
            try {
                const [owned, shared] = await Promise.all([
                    getUserPlaylistsWithNoteStatus(noteId),
                    getMyEditorPlaylists(),
                ]);
                setPlaylists(owned || []);
                const sharedWithStatus = await Promise.all((shared || []).map(async (playlist) => ({
                    ...playlist,
                    isPresent: (await isNotePresentInPlaylist(playlist._id, noteId)).isPresent,
                })));
                setEditorPlaylists(sharedWithStatus);
            } catch {
                setError("Failed to fetch your playlists");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatuses();
    }, [isOpen, noteId]);

    const handleToggle = async (playlistId, currentIndex) => {
        const setCurrentPlaylists = activeTab === "owned" ? setPlaylists : setEditorPlaylists;
        const currentPlaylists = activeTab === "owned" ? playlists : editorPlaylists;
        const newPlaylists = currentPlaylists.map((playlist, index) => index === currentIndex ? { ...playlist, isPresent: !playlist.isPresent } : playlist);
        setCurrentPlaylists(newPlaylists);

        try {
            await toggleNoteInPlaylist(playlistId, noteId);
        } catch {
            setCurrentPlaylists(currentPlaylists);
            setError("Failed to update playlist");
        }
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;

        setIsCreating(true);
        setError("");
        try {
            // Create the playlist in the backend
            const newPlaylist = await createPlaylist({ name: newPlaylistName, isPrivate: false });
            
            // If successful, instantly add the note to it
            if (newPlaylist) {
                await toggleNoteInPlaylist(newPlaylist._id, noteId);
                setPlaylists([{ ...newPlaylist, isPresent: true }, ...playlists]);
                setNewPlaylistName("");
            }
        } catch (err) {
            setError(err.message || "Failed to create playlist");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => dispatch(closeModal())} 
            title="Save to Playlist" 
            maxWidth="max-w-md"
        >
            <div className="flex flex-col gap-4">
                {error && <div className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</div>}

                <div className="flex gap-4 border-b border-gray-200">
                    <button type="button" onClick={() => setActiveTab("owned")} className={`border-b-2 pb-2 text-sm font-medium ${activeTab === "owned" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}>My Playlists</button>
                    <button type="button" onClick={() => setActiveTab("shared")} className={`border-b-2 pb-2 text-sm font-medium ${activeTab === "shared" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}>Shared</button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                    {isLoading ? (
                        <div className="py-8 text-center text-gray-500">Loading your playlists...</div>
                    ) : (activeTab === "owned" ? playlists : editorPlaylists).length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">{activeTab === "owned" ? "You don't have any playlists yet." : "You don't have editor access to any shared playlists."}</p>
                    ) : (
                        (activeTab === "owned" ? playlists : editorPlaylists).map((playlist, index) => (
                            <button
                                key={playlist._id}
                                onClick={() => handleToggle(playlist._id, index)}
                                className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-gray-50 transition-colors text-left"
                            >
                                {playlist.isPresent ? (
                                    <CheckSquare className="h-5 w-5 text-blue-600" />
                                ) : (
                                    <Square className="h-5 w-5 text-gray-400" />
                                )}
                                <span className="text-sm font-medium text-gray-800">
                                    {playlist.name}
                                    {playlist.isPrivate && <span className="ml-2 text-xs text-gray-400">(Private)</span>}
                                </span>
                            </button>
                        ))
                    )}
                </div>

                {activeTab === "owned" && <><hr className="border-gray-100 my-2" />

                {/* Quick Create Form */}
                <form onSubmit={handleCreatePlaylist} className="flex items-end gap-2">
                    <div className="flex-1">
                        <Input
                            placeholder="New playlist name..."
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={isCreating || !newPlaylistName.trim()} className="px-3 h-[42px]">
                        {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                    </Button>
                </form></>}
            </div>
        </Modal>
    );
}
