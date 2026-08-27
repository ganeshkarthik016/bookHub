import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { KeyRound, Mail, UserRound } from "lucide-react";
import { changeGmail, sendEmailVerificationOtp } from "../services/user.service";
import { loginSuccess } from "../store/slices/authSlice";
import { openModal } from "../store/slices/uiSlice";
import { Button, Input } from "../components";

export default function AccountSettings() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState(user?.email || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sendingVerification, setSendingVerification] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        if (!email.trim() || email === user?.email) return;
        setLoading(true); setError("");
        try {
            await changeGmail({ email });
            dispatch(loginSuccess({ ...user, email: email.trim().toLowerCase(), isVerified: false }));
        } catch (err) { setError(err.message || "Could not change your email."); }
        finally { setLoading(false); }
    };

    const startVerification = async () => {
        setSendingVerification(true); setError("");
        try {
            await sendEmailVerificationOtp();
            navigate("/verify-email");
        } catch (err) { setError(err.message || "Could not send a verification code."); }
        finally { setSendingVerification(false); }
    };

    return <div className="mx-auto max-w-2xl pb-12"><div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Account settings</h1><p className="text-sm text-gray-500">Manage your profile, password, and email address.</p></div>
        <div className="space-y-6"><section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="flex items-center gap-2 font-semibold text-gray-900"><UserRound className="h-5 w-5 text-blue-600" />Profile</h2><p className="mt-1 text-sm text-gray-500">Update your name, bio, or profile picture.</p></div><Button onClick={() => dispatch(openModal("EDIT_PROFILE"))} bgColor="bg-gray-100 hover:bg-gray-200" textColor="text-gray-700">Edit profile</Button></div></section>
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="flex items-center gap-2 font-semibold text-gray-900"><KeyRound className="h-5 w-5 text-blue-600" />Password</h2><p className="mt-1 text-sm text-gray-500">Use a new password to secure your account.</p></div><Button onClick={() => dispatch(openModal("CHANGE_PASSWORD"))} bgColor="bg-gray-100 hover:bg-gray-200" textColor="text-gray-700">Change password</Button></div></section>
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-semibold text-gray-900"><Mail className="h-5 w-5 text-blue-600" />Email address</h2><p className="mt-1 text-sm text-gray-500">Changing your email requires a new verification code.</p>{error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}<form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"><Input label="Gmail address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /><div className="flex gap-2"><Button type="submit" disabled={loading || !email.trim() || email === user?.email}>{loading ? "Updating..." : "Change email"}</Button><Button type="button" onClick={startVerification} disabled={user?.isVerified || sendingVerification} bgColor="bg-green-600 hover:bg-green-700" title={user?.isVerified ? "This email is already verified" : "Send a verification code"}>{user?.isVerified ? "Verified" : sendingVerification ? "Sending..." : "Verify"}</Button></div></form></section>
        <section className="rounded-xl border border-red-100 bg-red-50/40 p-5"><h2 className="font-semibold text-red-700">Delete account</h2><p className="mt-1 text-sm text-red-600">This permanently removes your account and associated data.</p><Button onClick={() => dispatch(openModal("DELETE_ACCOUNT"))} bgColor="bg-red-600 hover:bg-red-700" className="mt-4">Delete account</Button></section></div></div>;
}
