import { useState } from "react";

export function useOptimisticToggle({ initialStatus = false, toggleApiCall }) {
    const [isToggled, setIsToggled] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async (e) => {
        // Prevent clicking the button from triggering parent links
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        // 1. Optimistic Update (Instant UI change)
        setIsToggled((prev) => !prev);
        setIsLoading(true);

        try {
            // 2. Fire the API call (e.g., toggleFollow or toggleLike)
            await toggleApiCall();
        } catch (error) {
            // 3. Rollback if the API fails
            setIsToggled((prev) => !prev);
            console.error("Toggle action failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { isToggled, isLoading, handleToggle };
}