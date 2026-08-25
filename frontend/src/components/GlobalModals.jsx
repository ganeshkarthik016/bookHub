import { useSelector } from "react-redux";
import {
    UploadNoteModal,
    WriteNoteModal,
    CreatePlaylistModal,
    ChangePasswordModal,
    EditProfileModal,
    DeleteAccountModal,
    ResetPasswordModal
} from "./index.js"; 

export default function GlobalModals() {
    const { activeModal } = useSelector((state) => state.ui);
    const { user } = useSelector((state) => state.auth); // Grab the user from Redux

    if (!activeModal) return null;

    return (
        <>
            <UploadNoteModal />
            <WriteNoteModal />
            <CreatePlaylistModal />
            <ChangePasswordModal />
            <EditProfileModal currentUser={user} /> 
            <DeleteAccountModal />
            <ResetPasswordModal />
        </>
    );
}