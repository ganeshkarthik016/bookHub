import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import {
    loginSuccess,
} from "../../store/slices/authSlice";

import { registerUser } from "../../services/auth.service";

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const onSubmit = async (data) => {
        setMessage("");
        setErrorMessage("");

        try {
            const formData = new FormData();

            formData.append("userName", data.userName);
            formData.append("userFullName", data.userFullName);
            formData.append("email", data.email);
            formData.append("password", data.password);

            if (data.profilePic?.[0]) {
                formData.append("profilePic", data.profilePic[0]);
            }

            const response = await registerUser(formData);

            dispatch(loginSuccess(response.data));

            setMessage("Account created successfully!");

            setTimeout(() => {
                navigate("/");
            }, 700);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md space-y-4 p-8 border rounded-xl"
            >
                <h1 className="text-3xl font-bold">
                    Create Account
                </h1>

                <input
                    type="text"
                    placeholder="Username"
                    {...register("userName", {
                        required: "Username is required",
                    })}
                    className="w-full border p-3 rounded"
                />

                {errors.userName && (
                    <p className="text-red-500 text-sm">
                        {errors.userName.message}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Full Name"
                    {...register("userFullName", {
                        required: "Full name is required",
                    })}
                    className="w-full border p-3 rounded"
                />

                {errors.userFullName && (
                    <p className="text-red-500 text-sm">
                        {errors.userFullName.message}
                    </p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    {...register("email", {
                        required: "Email is required",
                    })}
                    className="w-full border p-3 rounded"
                />

                {errors.email && (
                    <p className="text-red-500 text-sm">
                        {errors.email.message}
                    </p>
                )}

                <input
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 8,
                            message:
                                "Password must be at least 8 characters",
                        },
                    })}
                    className="w-full border p-3 rounded"
                />

                {errors.password && (
                    <p className="text-red-500 text-sm">
                        {errors.password.message}
                    </p>
                )}

                <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                        <span className="text-gray-700 text-sm">
                            Choose profile picture
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            {...register("profilePic", {
                                onChange: (e) => {
                                    const file = e.target.files?.[0];

                                    if (file) {
                                        if (preview) {
                                            URL.revokeObjectURL(preview);
                                        }

                                        setPreview(
                                            URL.createObjectURL(file)
                                        );
                                    } else {
                                        setPreview(null);
                                    }
                                },
                            })}
                            className="hidden"
                        />
                    </label>

                    {preview && (
                        <img
                            src={preview}
                            alt="Profile preview"
                            className="w-16 h-16 rounded-full object-cover border"
                        />
                    )}
                </div>

                {message && (
                    <p className="text-green-600 text-sm">
                        {message}
                    </p>
                )}

                {errorMessage && (
                    <p className="text-red-500 text-sm">
                        {errorMessage}
                    </p>
                )}
                <p className="text-sm text-center text-gray-600">
    Already have an account?{" "}
    <button
        type="button"
        onClick={() => navigate("/login")}
        className="text-black font-medium hover:underline"
    >
        Login
    </button>
</p>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white p-3 rounded disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Creating account..."
                        : "Register"}
                </button>
            </form>
        </div>
    );
}

export default Register;
