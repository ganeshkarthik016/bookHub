import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    loginStart,
    loginSuccess,
    loginFailure,
} from "../../store/slices/authSlice";

import { loginUser } from "../../services/auth.service";

function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loading = useSelector((state) => state.auth.loading);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        dispatch(loginStart());

        try {
            const response = await loginUser({
                identifier,
                password,
            });

            dispatch(loginSuccess(response.data));

            setSuccessMessage("Login successful!");

            setTimeout(() => {
                navigate("/");
            }, 500);
        } catch (error) {
            dispatch(loginFailure());

            setErrorMessage(
                error.response?.data?.message ||
                "Login failed. Please check your credentials and try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-4 p-8 border rounded-xl"
            >
                <h1 className="text-3xl font-bold">
                    Login
                </h1>

                <input
                    type="text"
                    placeholder="Username or Email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full border p-3 rounded"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-3 rounded"
                    required
                />

                {successMessage && (
                    <p className="text-green-600 text-sm">
                        {successMessage}
                    </p>
                )}

                {errorMessage && (
                    <p className="text-red-500 text-sm">
                        {errorMessage}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white p-3 rounded disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p className="text-sm text-center text-gray-600">
    Don't have an account?{" "}
    <button
        type="button"
        onClick={() => navigate("/register")}
        className="text-black font-medium hover:underline"
    >
        Register
    </button>
</p>
            </form>
        </div>
    );
}

export default Login;