import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
// import { sharePlaylist } from "../services/playlist.service"; // Ensure service exists

export default function SharePlaylistModal({ isOpen, onClose, playlistId }) {
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("VIEWER");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleShare = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!userName.trim()) return setError("Please enter a username");

        setIsLoading(true);
        try {
            // Uncomment when service is imported
            // await sharePlaylist(playlistId, userName, role);
            
            setSuccessMessage(`Successfully invited @${userName} as a ${role.toLowerCase()}`);
            setUserName(""); // clear input for next invite
        } catch (err) {
            setError(err.message || "Failed to share playlist. Ensure the user exists.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => {
                setError("");
                setSuccessMessage("");
                onClose();
            }} 
            title="Share Playlist" 
            maxWidth="max-w-md"
        >
            <form onSubmit={handleShare} className="flex flex-col gap-4">
                <p className="text-sm text-gray-600 mb-2">
                    Invite collaborators to view or edit this playlist.
                </p>

                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-100">
                        {successMessage}
                    </div>
                )}

                <Input
                    label="Username"
                    placeholder="e.g., johndoe123"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="VIEWER">Viewer (Can only read)</option>
                        <option value="EDITOR">Editor (Can add/remove notes)</option>
                    </select>
                </div>

                <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <Button 
                        bgColor="bg-gray-100" 
                        textColor="text-gray-700"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Close
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={isLoading || !userName.trim()}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <UserPlus className="h-4 w-4" />
                        )}
                        Send Invite
                    </Button>
                </div>
            </form>
        </Modal>
    );
}