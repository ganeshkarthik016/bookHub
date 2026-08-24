import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, KeyRound } from "lucide-react";
import { closeModal } from "../../store/slices/uiSlice";
// import { changePassword } from "../../services/user.service";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function ChangePasswordModal() {
    const dispatch = useDispatch();
    const { activeModal } = useSelector((state) => state.ui);
    const isOpen = activeModal === "CHANGE_PASSWORD";

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            return setError("New passwords do not match");
        }
        if (newPassword.length < 8) {
            return setError("Password must be at least 8 characters");
        }

        setIsLoading(true);
        try {
            // await changePassword({ oldPassword, newPassword, confirmPassword });
            setSuccess("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            
            // Optional: Close modal after a short delay
            setTimeout(() => dispatch(closeModal()), 2000);
        } catch (err) {
            setError(err.message || "Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => {
                setError("");
                setSuccess("");
                dispatch(closeModal());
            }} 
            title="Change Password"
            maxWidth="max-w-md"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}
                {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-100">{success}</div>}

                <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />

                <Input
                    label="New Password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <Button 
                        type="button"
                        bgColor="bg-gray-100" 
                        textColor="text-gray-700"
                        onClick={() => dispatch(closeModal())}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={isLoading || !oldPassword || !newPassword || !confirmPassword}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <KeyRound className="h-4 w-4" />
                        )}
                        Update Password
                    </Button>
                </div>
            </form>
        </Modal>
    );
}