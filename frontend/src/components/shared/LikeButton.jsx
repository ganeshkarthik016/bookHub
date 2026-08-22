import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleLike } from "../../services/like.service";
import { useOptimisticToggle } from "../../hooks/useOptimisticToggle";

export default function LikeButton({ noteId, initialIsLiked = false, initialLikesCount = 0 }) {
    const [likesCount, setLikesCount] = useState(initialLikesCount);

    const { isToggled: isLiked, isLoading, handleToggle } = useOptimisticToggle({
        initialStatus: initialIsLiked,
        toggleApiCall: () => toggleLike(noteId)
    });

    const onLikeClick = (e) => {
        // Optimistically update the number count
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
        // Trigger the hook to handle the boolean state and the API
        handleToggle(e);
    };

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