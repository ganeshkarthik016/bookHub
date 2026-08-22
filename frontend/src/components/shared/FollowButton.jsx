import { toggleFollow } from "../../services/follow.service";
import { useOptimisticToggle } from "../../hooks/useOptimisticToggle";
import Button from "../ui/Button";

export default function FollowButton({ userId, initialIsFollowing = false, className = "" }) {
    const { isToggled: isFollowing, isLoading, handleToggle } = useOptimisticToggle({
        initialStatus: initialIsFollowing,
        // Pass a wrapped function so it executes with the correct ID
        toggleApiCall: () => toggleFollow(userId) 
    });

    return (
        <Button 
            onClick={handleToggle}
            disabled={isLoading}
            bgColor={isFollowing ? "bg-gray-100" : "bg-blue-600"}
            textColor={isFollowing ? "text-gray-800" : "text-white"}
            className={`px-4 py-1.5 text-sm font-semibold transition-colors ${className}`}
        >
            {isFollowing ? "Following" : "Follow"}
        </Button>
    );
}