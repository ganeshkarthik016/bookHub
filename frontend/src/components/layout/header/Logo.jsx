import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Menu } from "lucide-react";
import { toggleSidebar } from "../../../store/slices/uiSlice";

export default function Logo() {
    const dispatch = useDispatch();

    return (
        <div className="flex items-center gap-4">
            <button 
                onClick={() => dispatch(toggleSidebar())}
                className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
            >
                <Menu className="h-6 w-6 text-gray-700" />
            </button>
            <Link to="/" className="text-xl font-bold text-blue-600">
                BookHub
            </Link>
        </div>
    );
}