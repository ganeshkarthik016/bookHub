import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Flame, Clock, TrendingUp } from "lucide-react";
import { searchNotes } from "../services/note.service"; 
import { NoteCard, EmptyState } from "../components"; 

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentSort = searchParams.get("sort") || "newest";

    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInitialFeed = async () => {
            setIsLoading(true);
            setError("");
            try {
                // Empty query gives us the global public feed
                const data = await searchNotes({ sort: currentSort, page: 1, limit: 12 });
                if (data) {
                    setNotes(data.notes);
                    setHasMore(data.hasMore);
                    setPage(1);
                }
            } catch (err) {
                setError("Failed to load the feed. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialFeed();
    }, [currentSort]);

    const loadMore = async () => {
        const nextPage = page + 1;
        try {
            const data = await searchNotes({ sort: currentSort, page: nextPage, limit: 12 });
            if (data) {
                setNotes((prev) => [...prev, ...data.notes]);
                setHasMore(data.hasMore);
                setPage(nextPage);
            }
        } catch (err) {
            console.error("Failed to load more notes");
        }
    };

    const handleSortChange = (sortType) => {
        setSearchParams({ sort: sortType });
    };

    return (
        <div className="mx-auto w-full pb-12">
            
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Explore Notes</h1>
                    <p className="text-sm text-gray-500">Discover the best study materials from the community.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                    <button
                        onClick={() => handleSortChange("newest")}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            currentSort === "newest" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Clock className="h-4 w-4" /> Newest
                    </button>
                    <button
                        onClick={() => handleSortChange("popular")}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            currentSort === "popular" ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Flame className="h-4 w-4" /> Popular
                    </button>
                    <button
                        onClick={() => handleSortChange("views")}
                        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            currentSort === "views" ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <TrendingUp className="h-4 w-4" /> Viewed
                    </button>
                </div>
            </div>

            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                    {error}
                </div>
            ) : isLoading ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : notes.length === 0 ? (
                <EmptyState 
                    title="No Notes Found" 
                    description="It looks like the community hasn't uploaded any public notes yet. Be the first!"
                />
            ) : (
                <div className="flex flex-col items-center">
                    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                        {notes.map((note) => (
                            <NoteCard key={note._id} note={note} />
                        ))}
                    </div>

                    {hasMore && (
                        <button
                            onClick={loadMore}
                            className="mt-10 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
                        >
                            Load More Notes
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}