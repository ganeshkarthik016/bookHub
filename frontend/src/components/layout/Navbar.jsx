import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../store/slices/authSlice";
import { logoutUser } from "../../services/auth.service";

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error(
                error.response?.data?.message ||
                "Logout failed"
            );
        } finally {
            dispatch(logout());
            navigate("/login");
        }
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b">
            <h1 className="text-xl font-bold">
                BookHub
            </h1>

            <div className="flex items-center gap-4">
                <span>
                    {user?.userFullName || user?.userName}
                </span>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded bg-black text-white"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;