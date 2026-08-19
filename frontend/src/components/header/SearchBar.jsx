import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            navigate(`/search?q=${e.target.value.trim()}`);
        }
    };

    return (
        <div className="hidden max-w-md flex-1 items-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 md:flex mx-4">
            <Search className="h-5 w-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search users or notes... (Press Enter)"
                className="ml-2 w-full bg-transparent outline-none"
                onKeyDown={handleSearch}
            />
        </div>
    );
}