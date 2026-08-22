import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Loader2, Save } from "lucide-react";
import { closeModal } from "../../store/slices/uiSlice";
// import { updateAccountDetails, updateProfilePic } from "../../services/user.service";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function EditProfileModal({ currentUser }) {
    const dispatch = useDispatch();
    const { activeModal } = useSelector((state) => state.ui);
    const isOpen = activeModal === "EDIT_PROFILE";

    // Text Data State
    const [userFullName, setUserFullName] = useState("");
    const [bio, setBio] = useState("");
    const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);

    // Image Data State
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [isUpdatingPic, setIsUpdatingPic] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Populate initial data when modal opens
    useEffect(() => {
        if (currentUser && isOpen) {
            setUserFullName(currentUser.userFullName || "");
            setBio(currentUser.bio || "");
            setPreviewUrl(currentUser.profilePic?.url || "https://via.placeholder.com/100");
        }
    }, [currentUser, isOpen]);

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsUpdatingInfo(true);

        try {
            // await updateAccountDetails({ userFullName, bio });
            setSuccess("Profile details updated successfully!");
            // TODO: dispatch an action to update currentUser in Redux authSlice
        } catch (err) {
            setError(err.message || "Failed to update profile info");
        } finally {
            setIsUpdatingInfo(false);
        }
    };

    const handlePicSubmit = async (e) => {
        e.preventDefault();
        if (!profilePic) return;
        
        setError("");
        setSuccess("");
        setIsUpdatingPic(true);

        try {
            const formData = new FormData();
            formData.append("profilePic", profilePic);
            // await updateProfilePic(formData);
            setSuccess("Profile picture updated successfully!");
            setProfilePic(null);
            // TODO: dispatch an action to update currentUser in Redux authSlice
        } catch (err) {
            setError(err.message || "Failed to update profile picture");
        } finally {
            setIsUpdatingPic(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file)); // Show instant preview
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
            title="Edit Profile"
            maxWidth="max-w-lg"
        >
            <div className="flex flex-col gap-8">
                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}
                {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-100">{success}</div>}

                {/* Section 1: Profile Picture */}
                <form onSubmit={handlePicSubmit} className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md">
                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                        <label className="absolute bottom-0 left-0 right-0 flex cursor-pointer items-center justify-center bg-black/50 py-1 text-white hover:bg-black/70 transition-colors">
                            <Camera className="h-4 w-4" />
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    
                    {profilePic && (
                        <Button type="submit" disabled={isUpdatingPic} className="flex items-center gap-2 text-sm">
                            {isUpdatingPic ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Picture
                        </Button>
                    )}
                </form>

                {/* Section 2: Profile Info */}
                <form onSubmit={handleInfoSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Full Name"
                        placeholder="e.g., John Doe"
                        value={userFullName}
                        onChange={(e) => setUserFullName(e.target.value)}
                    />
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows="3"
                            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mt-2 flex justify-end gap-3 border-t border-gray-100 pt-4">
                        <Button 
                            type="button"
                            bgColor="bg-gray-100" 
                            textColor="text-gray-700"
                            onClick={() => dispatch(closeModal())}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdatingInfo || (!userFullName.trim() && !bio.trim())}>
                            {isUpdatingInfo ? "Saving..." : "Save Details"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}