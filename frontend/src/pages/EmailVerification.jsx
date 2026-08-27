import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, Loader2, Mail, ShieldCheck } from "lucide-react";
import { sendEmailVerificationOtp, verifyEmailOtp } from "../services/user.service";
import { logout } from "../store/slices/authSlice";
import { Button, Input } from "../components";

export default function EmailVerification() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        if (user?.isVerified) navigate("/", { replace: true });
    }, [user, navigate]);

    const sendCode = async () => {
        setSending(true); setError(""); setMessage("");
        try {
            await sendEmailVerificationOtp();
            setMessage("A verification code was sent to your Gmail account.");
        } catch (err) {
            setError(err.message || "Could not send a verification code.");
        } finally { setSending(false); }
    };

    const verify = async (event) => {
        event.preventDefault();
        setError(""); setMessage("");
        if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit code from your email.");
        setLoading(true);
        try {
            await verifyEmailOtp({ otp });
            setVerified(true);
        } catch (err) {
            setError(err.message || "The code is invalid or expired.");
        } finally { setLoading(false); }
    };

    const goToLogin = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    return <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {verified ? <div className="text-center"><CheckCircle2 className="mx-auto h-14 w-14 text-green-500" /><h1 className="mt-4 text-2xl font-bold text-gray-900">Email verified</h1><p className="mt-2 text-sm text-gray-600">Your account is ready. Please sign in to continue.</p><Button onClick={goToLogin} className="mt-6 w-full">Go to login</Button></div> : <>
                <div className="text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50"><ShieldCheck className="h-7 w-7 text-blue-600" /></div><h1 className="mt-4 text-2xl font-bold text-gray-900">Verify your email</h1><p className="mt-2 text-sm text-gray-600">Enter the 6-digit code sent to {user?.email || "your email"}.</p></div>
                <form onSubmit={verify} className="mt-6 space-y-4">
                    {error && <p className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">{error}</p>}
                    {message && <p className="rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-700">{message}</p>}
                    <Input label="Verification code" value={otp} maxLength={6} inputMode="numeric" onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="123456" />
                    <Button type="submit" disabled={loading || otp.length !== 6} className="w-full">{loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Verifying...</span> : "Verify email"}</Button>
                </form>
                <button type="button" onClick={sendCode} disabled={sending} className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:underline disabled:text-gray-400"><Mail className="h-4 w-4" />{sending ? "Sending..." : "Resend code"}</button>
                <p className="mt-5 text-center text-xs text-gray-500">Already verified? <Link to="/login" className="font-medium text-blue-600">Log in</Link></p>
            </>}
        </div>
    </div>;
}
