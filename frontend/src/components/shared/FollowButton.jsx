import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { toggleFollow, isFollowing as checkFollowStatus } from "../../services/follow.service"; 
import Button from "../ui/Button";

export default function FollowButton({ userId, initialIsFollowing = false, className = "" }) {
    const { user: currentUser } = useSelector((state) => state.auth);
    
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            if (!currentUser || currentUser._id === userId) {
                setIsChecking(false);
                return;
            }
            try {
                const response = await checkFollowStatus(userId);
                setIsFollowing(response.isFollowing); 
            } catch {
                console.error("Failed to check follow status");
            } finally {
                setIsChecking(false);
            }
        };

        fetchStatus();
    }, [userId, currentUser]);

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsLoading(true);
        setIsFollowing(!isFollowing); 
        
        try {
            await toggleFollow(userId);
        } catch {
            setIsFollowing(isFollowing); 
            console.error("Failed to toggle follow");
        } finally {
            setIsLoading(false);
        }
    };

    if (isChecking) {
        return (
            <Button disabled bgColor="bg-gray-100" className={`w-24 px-4 py-1.5 ${className}`}>
                <Loader2 className="h-4 w-4 animate-spin text-gray-400 mx-auto" />
            </Button>
        );
    }

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