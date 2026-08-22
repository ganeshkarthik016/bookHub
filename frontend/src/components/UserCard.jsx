import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

export default function UserCard({ user, currentUserId }) {
    const isSelf = currentUserId === user._id;

    return (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <Link to={`/profile/${user.userName}`} className="shrink-0">
                    <img 
                        src={user.profilePic?.url || "https://via.placeholder.com/50"} 
                        alt={user.userName}
                        className="h-12 w-12 rounded-full border border-gray-200 object-cover"
                    />
                </Link>

                {/* Info */}
                <div className="flex flex-col">
                    <Link 
                        to={`/profile/${user.userName}`}
                        className="text-base font-bold text-gray-900 hover:text-blue-600"
                    >
                        {user.userFullName || user.userName}
                    </Link>
                    <span className="text-sm text-gray-500">@{user.userName}</span>
                    
                    {/* Optional: Show mutual friends if passed from suggestions */}
                    {user.mutualFriends !== undefined && (
                        <span className="mt-0.5 text-xs text-gray-400">
                            {user.mutualFriends} mutual friends
                        </span>
                    )}
                </div>
            </div>

            {/* Hide follow button if looking at your own card */}
            {!isSelf && (
                <FollowButton 
                    userId={user._id} 
                    initialIsFollowing={user.isFollowing} 
                />
            )}
        </div>
    );
}