import { useState } from "react";
import { Loader2, KeyRound } from "lucide-react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function OtpModal({ 
    isOpen, 
    onClose, 
    onSubmit, 
    title = "Enter Verification Code", 
    description = "We sent a 6-digit code to your email. It will expire in 15 minutes.",
    isLoading 
}) {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Standard 6-digit validation
        if (!otp || otp.trim().length !== 6 || isNaN(otp)) {
            return setError("Please enter a valid 6-digit code.");
        }

        try {
            await onSubmit(otp.trim());
            setOtp(""); // Clear on success
        } catch (err) {
            setError(err.message || "Invalid or expired OTP");
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => {
                setError("");
                setOtp("");
                onClose();
            }} 
            title={title}
            maxWidth="max-w-sm"
        >
            <form onSubmit={handleSubmit} className="flex flex-col items-center text-center">
                
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 border border-blue-100">
                    <KeyRound className="h-8 w-8 text-blue-600" />
                </div>
                
                <p className="mb-6 text-sm text-gray-600">
                    {description}
                </p>

                {error && (
                    <div className="mb-4 w-full rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                <div className="w-full mb-6">
                    <Input
                        placeholder="• • • • • •"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="text-center text-2xl tracking-[0.5em] font-mono font-bold"
                    />
                </div>

                <div className="flex w-full flex-col gap-3">
                    <Button type="submit" disabled={isLoading || otp.length !== 6} className="w-full">
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                            </span>
                        ) : (
                            "Verify Code"
                        )}
                    </Button>
                    <Button 
                        type="button" 
                        bgColor="bg-transparent" 
                        textColor="text-gray-500 hover:text-gray-700" 
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
}