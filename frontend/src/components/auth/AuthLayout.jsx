import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function AuthLayout({ authentication = true }) {
    const {
        isAuthenticated,
        authChecked,
    } = useSelector((state) => state.auth);

    if (!authChecked) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
            </div>
        );
    }

    if (authentication && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!authentication && isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;