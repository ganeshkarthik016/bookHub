import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { loginUser } from "../services/auth.service";
import { loginSuccess } from "../store/slices/authSlice";
import { openModal } from "../store/slices/uiSlice";
import { Input, Button } from "../components";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.identifier.trim() || !formData.password) {
            return setError("Please fill in all fields");
        }

        setIsLoading(true);
        try {
            const loginData = await loginUser(formData);
            
            if (loginData) {
                dispatch(loginSuccess(loginData));
                navigate("/"); 
            }
        } catch (err) {
            setError(err.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-col items-center">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p className="mt-2 text-sm text-gray-600">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-5">
                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                <Input
                    label="Username or Email"
                    name="identifier"
                    placeholder="Enter your username or email"
                    value={formData.identifier}
                    onChange={handleChange}
                />

                <div>
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <div className="mt-2 flex justify-end">
                        <button 
                            type="button" 
                            onClick={() => dispatch(openModal("RESET_PASSWORD"))}
                            className="text-xs font-medium text-blue-600 hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
                        </span>
                    ) : (
                        "Sign In"
                    )}
                </Button>
            </form>

            <p className="mt-6 text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-blue-600 hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    );
}