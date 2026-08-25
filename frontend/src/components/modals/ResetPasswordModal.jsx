import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, KeyRound, Mail, ArrowRight } from "lucide-react";
import { closeModal } from "../../store/slices/uiSlice";
import { forgetPasswordGenerateOtp, verifyResetPasswordOtp } from "../../services/user.service";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function ResetPasswordModal() {
    const dispatch = useDispatch();
    const { activeModal } = useSelector((state) => state.ui);
    const isOpen = activeModal === "RESET_PASSWORD";

    const [step, setStep] = useState(1); // Step 1: Request OTP | Step 2: Verify & Reset
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // --- STEP 1: Send the OTP ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!email.trim()) return setError("Please enter your email address.");

        setIsLoading(true);
        try {
            await forgetPasswordGenerateOtp({ email });
            setSuccess("OTP sent successfully to your email.");
            setStep(2); // Move to password reset form
        } catch (err) {
            setError(err.message || "Failed to send OTP. Check if the email is correct.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- STEP 2: Verify OTP & Change Password ---
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!otp || otp.length !== 6) return setError("Please enter a valid 6-digit OTP.");
        if (newPassword !== confirmPassword) return setError("Passwords do not match.");
        if (newPassword.length < 8) return setError("Password must be at least 8 characters.");

        setIsLoading(true);
        try {
            await verifyResetPasswordOtp({ 
                email, 
                otp, 
                newPassword, 
                confirmPassword 
            });
            
            setSuccess("Password has been reset successfully! You can now log in.");
            
            // Auto close after 2 seconds
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err) {
            setError(err.message || "Invalid OTP or failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
        dispatch(closeModal());
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleClose} 
            title="Reset Password"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col gap-4">
                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}
                {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-100">{success}</div>}

                {/* --- UI for STEP 1: Email Input --- */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                        <p className="text-sm text-gray-600">
                            Enter your registered email address. We'll send you a 6-digit code to reset your password.
                        </p>
                        
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
                            <Button type="button" bgColor="bg-gray-100" textColor="text-gray-700" onClick={handleClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading || !email} className="flex items-center gap-2">
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                                Send Code
                            </Button>
                        </div>
                    </form>
                )}

                {/* --- UI for STEP 2: OTP and New Password Input --- */}
                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                        <p className="text-sm text-gray-600">
                            Code sent to <span className="font-semibold text-gray-900">{email}</span>.
                        </p>

                        <Input
                            label="6-Digit OTP"
                            placeholder="• • • • • •"
                            value={otp}
                            maxLength={6}
                            onChange={(e) => setOtp(e.target.value)}
                            className="tracking-widest font-mono font-bold"
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
                            placeholder="Must match new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
                            <button 
                                type="button" 
                                onClick={() => setStep(1)} 
                                className="text-sm font-semibold text-blue-600 hover:underline"
                            >
                                Change Email
                            </button>
                            
                            <div className="flex gap-3">
                                <Button type="submit" disabled={isLoading || otp.length !== 6 || !newPassword || !confirmPassword} className="flex items-center gap-2">
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                                    Reset Password
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}