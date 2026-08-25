import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FolderPlus, Loader2 } from "lucide-react";
import { closeModal } from "../../store/slices/uiSlice";
import { createPlaylist } from "../../services/playlist.service"; 
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function CreatePlaylistModal() {
    const dispatch = useDispatch();
    const { activeModal } = useSelector((state) => state.ui);
    const isOpen = activeModal === "CREATE_PLAYLIST";

    const [name, setName] = useState("");
    const [shortNotes, setShortNotes] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) return setError("Playlist name is required");

        setIsLoading(true);
        try {
            await createPlaylist({ name, shortNotes, isPrivate }); // UNCOMMENTED
            
            setName("");
            setShortNotes("");
            setIsPrivate(false);
            dispatch(closeModal());
        } catch (err) {
            setError(err.message || "Failed to create playlist");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} title="Create New Playlist" maxWidth="max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}
                <Input label="Playlist Name *" placeholder="e.g., Semester 3 Finals" value={name} onChange={(e) => setName(e.target.value)} />
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
                    <textarea value={shortNotes} onChange={(e) => setShortNotes(e.target.value)} placeholder="What is this playlist about?" rows="2" className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                    <input type="checkbox" id="playlistPrivate" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="playlistPrivate" className="text-sm font-medium text-gray-700">Make this playlist private</label>
                </div>
                <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <Button type="button" bgColor="bg-gray-100" textColor="text-gray-700" onClick={() => dispatch(closeModal())} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" disabled={isLoading || !name.trim()} className="flex items-center gap-2">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />} Create Playlist
                    </Button>
                </div>
            </form>
        </Modal>
    );
}