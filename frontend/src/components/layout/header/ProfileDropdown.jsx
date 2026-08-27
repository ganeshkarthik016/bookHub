import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, LogOut, Settings } from "lucide-react";
import { logoutUser } from "../../../services/auth.service"; 
import { logout } from "../../../store/slices/authSlice"; 

export default function ProfileDropdown() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const handleLogout = async () => {
        setIsOpen(false);
        try {
            await logoutUser();
            dispatch(logout()); // CHANGED
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <img 
                    src={user.profilePic?.url || "https://via.placeholder.com/40"} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    <Link 
                        to={`/profile/${user.userName}`} 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                    >
                        <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsOpen(false)}><Settings className="mr-2 h-4 w-4" /> Settings</Link>
                    <button 
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </button>
                </div>
            )}
        </div>
    );
}
