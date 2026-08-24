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
    createPlaylist 
} from "../../services/playlist.service";

export default function SaveToPlaylistModal({ noteId }) {
    const dispatch = useDispatch();
    const { activeModal } = useSelector((state) => state.ui);
    const isOpen = activeModal === "SAVE_TO_PLAYLIST";

    const [playlists, setPlaylists] = useState([]);
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
                const data = await getUserPlaylistsWithNoteStatus(noteId);
                if (data) setPlaylists(data);
            } catch (err) {
                setError("Failed to fetch your playlists");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatuses();
    }, [isOpen, noteId]);

    const handleToggle = async (playlistId, currentIndex) => {
        // Optimistic UI update for instant feedback
        const newPlaylists = [...playlists];
        newPlaylists[currentIndex].isPresent = !newPlaylists[currentIndex].isPresent;
        setPlaylists(newPlaylists);

        try {
            // Using the exact name from your playlist.service.js
            await toggleNoteInPlaylist(playlistId, noteId);
        } catch (err) {
            // Revert on failure
            newPlaylists[currentIndex].isPresent = !newPlaylists[currentIndex].isPresent;
            setPlaylists([...newPlaylists]);
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

                {/* The List of Playlists */}
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                    {isLoading ? (
                        <div className="py-8 text-center text-gray-500">Loading your playlists...</div>
                    ) : playlists.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">You don't have any playlists yet.</p>
                    ) : (
                        playlists.map((playlist, index) => (
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

                <hr className="border-gray-100 my-2" />

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
                </form>
            </div>
        </Modal>
    );
}