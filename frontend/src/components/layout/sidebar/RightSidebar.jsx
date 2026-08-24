import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSuggestions } from "../../services/follow.service";
import FollowButton from "../shared/FollowButton";

export default function RightSidebar() {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            setIsLoading(true);
            try {
                // Fetch page 1 of suggestions
                const data = await getSuggestions(1); 
                if (data && Array.isArray(data)) {
                    setSuggestions(data);
                }
            } catch (error) {
                console.error("Failed to load suggestions", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    return (
        <aside className="hidden w-80 flex-shrink-0 border-l border-gray-200 bg-white p-6 xl:block">
            <div className="sticky top-20">
                <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Suggested for you
                </h3>
                
                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        <div className="animate-pulse text-sm text-gray-400">Loading suggestions...</div>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((suggestion) => (
                            <div key={suggestion._id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Link to={`/profile/${suggestion.user.userName}`} className="shrink-0">
                                        <img 
                                            src={suggestion.user.profilePic?.url || "https://via.placeholder.com/40"} 
                                            alt={suggestion.user.userName} 
                                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                        />
                                    </Link>
                                    <div className="flex flex-col">
                                        <Link 
                                            to={`/profile/${suggestion.user.userName}`}
                                            className="text-sm font-bold text-gray-900 hover:underline line-clamp-1"
                                        >
                                            {suggestion.user.userName}
                                        </Link>
                                        <span className="text-xs text-gray-500">
                                            {suggestion.mutualFriends} mutual friends
                                        </span>
                                    </div>
                                </div>
                                <FollowButton 
                                    userId={suggestion._id} 
                                    initialIsFollowing={false} 
                                    className="px-3 py-1 text-xs" 
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500">No suggestions right now.</div>
                    )}
                </div>

                <div className="mt-8 text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} BookHub</p>
                </div>
            </div>
        </aside>
    );
}