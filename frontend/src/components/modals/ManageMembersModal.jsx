import { useState, useEffect } from "react";
import { UserMinus, Loader2, Shield } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { getPlaylistMembers, updateMemberRole, removeMember } from "../../services/playlist.service"; 

export default function ManageMembersModal({ isOpen, onClose, playlistId }) {
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isOpen || !playlistId) return;

        const fetchMembers = async () => {
            setIsLoading(true);
            try {
                const data = await getPlaylistMembers(playlistId); 
                setMembers(data);
            } catch {
                setError("Failed to load members.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembers();
    }, [isOpen, playlistId]);

    const handleRoleChange = async (userId, newRole) => {
        setActionLoading(userId);
        try {
            await updateMemberRole(playlistId, userId, newRole); 
            setMembers((prev) => prev.map((m) => m.user._id === userId ? { ...m, role: newRole } : m));
        } catch (err) {
            setError(err.message || "Failed to update role");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemove = async (userId) => {
        setActionLoading(userId);
        try {
            await removeMember(playlistId, userId); 
            setMembers((prev) => prev.filter((m) => m.user._id !== userId));
        } catch (err) {
            setError(err.message || "Failed to remove member");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manage Collaborators" maxWidth="max-w-lg">
            <div className="flex flex-col gap-4">
                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
                <div className="max-h-80 overflow-y-auto pr-2">
                    {isLoading ? (
                        <div className="py-8 text-center text-gray-500">Loading members...</div>
                    ) : members.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">No members found.</div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {members.map((member) => (
                                <div key={member.user._id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <img src={member.user.profilePic?.url || "https://via.placeholder.com/40"} alt={member.user.userName} className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-900">{member.user.userName}</span>
                                            <span className="text-xs text-gray-500 capitalize">{member.role.toLowerCase()}</span>
                                        </div>
                                    </div>
                                    {member.role !== "OWNER" && (
                                        <div className="flex items-center gap-2">
                                            <select value={member.role} onChange={(e) => handleRoleChange(member.user._id, e.target.value)} disabled={actionLoading === member.user._id} className="rounded border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500">
                                                <option value="VIEWER">Viewer</option>
                                                <option value="EDITOR">Editor</option>
                                            </select>
                                            <button onClick={() => handleRemove(member.user._id)} disabled={actionLoading === member.user._id} className="rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50" title="Remove User">
                                                {actionLoading === member.user._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserMinus className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    )}
                                    {member.role === "OWNER" && <Shield className="h-5 w-5 text-blue-500 mr-2" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
                    <Button onClick={onClose} bgColor="bg-gray-100" textColor="text-gray-700">Done</Button>
                </div>
            </div>
        </Modal>
    );
}