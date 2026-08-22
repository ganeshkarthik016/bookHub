import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";

export default function CommentItem({ comment, currentUserId, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [showOptions, setShowOptions] = useState(false);

    const isOwner = currentUserId === comment.user?._id;

    const handleSave = () => {
        if (editText.trim() && editText !== comment.text) {
            onEdit(comment._id, editText);
        }
        setIsEditing(false);
    };

    return (
        <div className="flex gap-4 border-b border-gray-100 py-4 last:border-0">
            {/* User Avatar */}
            <Link to={`/profile/${comment.user?.userName}`} className="flex-shrink-0">
                <img 
                    src={comment.user?.profilePic?.url || "https://via.placeholder.com/40"} 
                    alt={comment.user?.userName}
                    className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                />
            </Link>

            <div className="flex-1">
                {/* Header: Name, Date, and Options */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link 
                            to={`/profile/${comment.user?.userName}`}
                            className="text-sm font-bold text-gray-900 hover:underline"
                        >
                            {comment.user?.userName}
                        </Link>
                        <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {comment.is_edited && (
                            <span className="text-[10px] italic text-gray-400">(edited)</span>
                        )}
                    </div>

                    {/* Options Menu (Only if owner) */}
                    {isOwner && (
                        <div className="relative">
                            <button 
                                onClick={() => setShowOptions(!showOptions)}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                            
                            {showOptions && (
                                <div className="absolute right-0 top-6 z-10 w-32 rounded-md border border-gray-200 bg-white shadow-lg">
                                    <button 
                                        onClick={() => { setIsEditing(true); setShowOptions(false); }}
                                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Edit2 className="mr-2 h-3 w-3" /> Edit
                                    </button>
                                    <button 
                                        onClick={() => { onDelete(comment._id); setShowOptions(false); }}
                                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="mr-2 h-3 w-3" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Comment Body */}
                {isEditing ? (
                    <div className="mt-2">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full resize-none rounded-lg border border-blue-200 bg-white p-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            rows="2"
                        />
                        <div className="mt-2 flex gap-2">
                            <button 
                                onClick={handleSave}
                                className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                                Save
                            </button>
                            <button 
                                onClick={() => { setIsEditing(false); setEditText(comment.text); }}
                                className="rounded bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                        {comment.text}
                    </p>
                )}
            </div>
        </div>
    );
}