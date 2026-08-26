import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { toggleLike, isLiked as checkLikeStatus } from "../../services/like.service";

export default function LikeButton({ noteId, initialLikesCount = 0 }) {
    const { user: currentUser } = useSelector((state) => state.auth);
    
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (!currentUser) {
                setIsChecking(false);
                return;
            }
            try {
                // Use the aliased function
                const response = await checkLikeStatus(noteId);
                setIsLiked(response.isLiked);
            } catch (error) {
                console.error("Failed to check like status");
            } finally {
                setIsChecking(false);
            }
        };

        fetchLikeStatus();
    }, [noteId, currentUser]);

    const onLikeClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

        try {
            await toggleLike(noteId);
        } catch (error) {
            setIsLiked(isLiked);
            setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
            console.error("Failed to toggle like");
        } finally {
            setIsLoading(false);
        }
    };

    if (isChecking) {
        return (
            <div className="flex h-8 w-12 items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <button
            onClick={onLikeClick}
            disabled={isLoading}
            className="group flex items-center gap-1.5 transition-colors focus:outline-none disabled:opacity-50"
        >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                isLiked 
                    ? "bg-red-50 text-red-500" 
                    : "bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500"
            }`}>
                <Heart 
                    className={`h-4 w-4 transition-all ${isLiked ? "fill-current scale-110" : ""}`} 
                />
            </div>
            <span className={`text-sm font-medium ${isLiked ? "text-red-500" : "text-gray-600"}`}>
                {likesCount}
            </span>
        </button>
    );
}