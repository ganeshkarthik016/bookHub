import { useState, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { getNoteComments, addComment, deleteMyComment, editMyComment } from "../../services/comment.service"; 
import CommentItem from "./CommentItem";

export default function CommentSection({ noteId, currentUserId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // Fetch initial comments
    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const data = await getNoteComments(noteId, 1);
                if (data) {
                    setComments(data.comments);
                    setHasMore(data.hasMore);
                }
            } catch {
                console.error("Failed to load comments");
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [noteId]);

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsPosting(true);
        try {
            const response = await addComment(noteId, newComment);
            if (response) {
                // Optimistically add the new comment to the top of the list
                setComments([{...response, user: { _id: currentUserId, userName: "You" }}, ...comments]);
                setNewComment("");
            }
        } catch {
            console.error("Failed to post comment");
        } finally {
            setIsPosting(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await deleteMyComment(commentId);
            setComments(comments.filter(c => c._id !== commentId));
        } catch {
            console.error("Failed to delete");
        }
    };

    const handleEdit = async (commentId, newText) => {
        try {
            // FIX: Passed newText as a string instead of { text: newText }
            const updated = await editMyComment(commentId, newText);
            setComments(comments.map(c => c._id === commentId ? updated : c));
        } catch {
            console.error("Failed to edit");
        }
    };

    const loadMore = async () => {
        const nextPage = page + 1;
        try {
            const data = await getNoteComments(noteId, nextPage);
            if (data) {
                setComments([...comments, ...data.comments]);
                setPage(nextPage);
                setHasMore(data.hasMore);
            }
        } catch {
            console.error("Failed to load more comments");
        }
    };

    return (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Comments</h3>

            {/* Comment Input Box */}
            <form onSubmit={handlePostComment} className="mb-8 flex items-start gap-3">
                <div className="flex-1">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
                        rows="3"
                    />
                    <div className="mt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPosting || !newComment.trim()}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isPosting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Post
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="flex flex-col">
                {isLoading ? (
                    <div className="py-8 text-center text-sm text-gray-500 animate-pulse">Loading comments...</div>
                ) : comments.length > 0 ? (
                    <>
                        {comments.map((comment) => (
                            <CommentItem 
                                key={comment._id} 
                                comment={comment} 
                                currentUserId={currentUserId}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                        
                        {/* Pagination Button */}
                        {hasMore && (
                            <button 
                                onClick={loadMore}
                                className="mt-4 w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                Load more comments
                            </button>
                        )}
                    </>
                ) : (
                    <div className="py-8 text-center text-sm text-gray-500">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                )}
            </div>
        </div>
    );
}