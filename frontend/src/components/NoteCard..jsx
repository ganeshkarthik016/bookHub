import { Heart, Eye, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function NoteCard({ note }) {
    // Fallback image if the user didn't upload a cover
    const coverUrl = note?.coverImage?.url || "https://via.placeholder.com/600x400?text=No+Cover+Image";

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
            {/* Cover Image */}
            <Link to={`/notes/${note._id}`} className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img 
                    src={coverUrl} 
                    alt={note.title} 
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {note.isPrivate && (
                    <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                        Private
                    </span>
                )}
            </Link>

            {/* Content Container */}
            <div className="flex flex-1 flex-col p-4">
                {/* Title & Description */}
                <Link to={`/notes/${note._id}`}>
                    <h3 className="line-clamp-1 text-lg font-bold text-gray-900 hover:text-blue-600">
                        {note.title}
                    </h3>
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {note.description || "No description provided."}
                </p>

                {/* Tags */}
                {note.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {note.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer: Author and Stats */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                    {/* Owner Info (if populated) */}
                    <Link to={`/profile/${note.owner?.userName}`} className="flex items-center gap-2 hover:opacity-80">
                        <img 
                            src={note.owner?.profilePic?.url || "https://via.placeholder.com/32"} 
                            alt={note.owner?.userName}
                            className="h-6 w-6 rounded-full object-cover border border-gray-200"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            {note.owner?.userName || "Unknown"}
                        </span>
                    </Link>

                    {/* Engagement Stats */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{note.likesCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{note.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{note.downloads || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}