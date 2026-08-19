import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function AuthLayout({ authentication = true }) {
    const {
        isAuthenticated,
        authChecked,
    } = useSelector((state) => state.auth);

    if (!authChecked) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (authentication && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!authentication && isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default AuthLayout;