import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2, UploadCloud } from "lucide-react";
import { registerUser, loginUser } from "../services/auth.service";
import { loginSuccess } from "../store/slices/authSlice";
import { Input, Button } from "../components";

export default function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        userFullName: "",
        userName: "",
        email: "",
        password: "",
    });
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // 1. Prepare FormData for registration
            const registerData = new FormData();
            registerData.append("userFullName", formData.userFullName);
            registerData.append("userName", formData.userName);
            registerData.append("email", formData.email);
            registerData.append("password", formData.password);
            if (profilePic) {
                registerData.append("profilePic", profilePic);
            }

            // 2. Register the User
            await registerUser(registerData);

            // 3. Immediately Log Them In
            const loginData = await loginUser({
                identifier: formData.email,
                password: formData.password
            });

            if (loginData) {
                dispatch(loginSuccess(loginData));
                navigate("/"); // Push to home feed
            }

        } catch (err) {
            setError(err.message || "Failed to create account");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-col items-center">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
                <p className="mt-2 text-sm text-gray-600">Join BookHub to share and find the best notes.</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                {/* Profile Pic Upload */}
                <div className="flex flex-col items-center justify-center gap-3 pb-2">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <UploadCloud className="h-6 w-6" />
                            </div>
                        )}
                    </div>
                    <label className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                        <span>Upload Avatar (Optional)</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                </div>

                <Input
                    label="Full Name *"
                    name="userFullName"
                    placeholder="e.g., John Doe"
                    value={formData.userFullName}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Username *"
                    name="userName"
                    placeholder="e.g., johndoe123"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Password *"
                    name="password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <Button type="submit" disabled={isLoading} className="w-full mt-6">
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                        </span>
                    ) : (
                        "Sign Up"
                    )}
                </Button>
            </form>

            <p className="mt-6 text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
}