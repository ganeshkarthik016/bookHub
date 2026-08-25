import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { closeModal } from "../../store/slices/uiSlice";
import { logout } from "../../store/slices/authSlice"; // CHANGED to logout
import { deleteAccount } from "../../services/user.service";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function DeleteAccountModal() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { activeModal } = useSelector((state) => state.ui);
    const isOpen = activeModal === "DELETE_ACCOUNT";

    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async (e) => {
        e.preventDefault();
        setError("");

        if (!password) {
            return setError("Password is required to delete your account.");
        }

        setIsLoading(true);
        try {
            await deleteAccount({ password });
            
            // On success, clear the Redux state, close the modal, and boot them to signup
            dispatch(closeModal());
            dispatch(logout()); // CHANGED to logout()
            navigate("/signup");
        } catch (err) {
            setError(err.message || "Failed to delete account. Please check your password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => {
                setError("");
                setPassword("");
                dispatch(closeModal());
            }} 
            title="Delete Account"
            maxWidth="max-w-md"
        >
            <form onSubmit={handleDelete} className="flex flex-col gap-4">
                
                {/* Warning Banner */}
                <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-red-800 border border-red-100">
                    <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-600" />
                    <div className="text-sm">
                        <p className="font-bold">Warning: This action is irreversible.</p>
                        <p className="mt-1">
                            Permanently delete your account and all associated data (notes, playlists, comments, and likes).
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                        {error}
                    </div>
                )}

                <div className="mt-2">
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Enter your password to confirm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <Button 
                        type="button"
                        bgColor="bg-gray-100" 
                        textColor="text-gray-700"
                        onClick={() => {
                            setError("");
                            setPassword("");
                            dispatch(closeModal());
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        bgColor="bg-red-600 hover:bg-red-700"
                        disabled={isLoading || !password}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        Delete Account
                    </Button>
                </div>
            </form>
        </Modal>
    );
}