import { ListMusic, Lock, Globe, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

export default function PlaylistCard({ playlist }) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md">
            
            {/* Header: Icon and Privacy Status */}
            <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ListMusic className="h-6 w-6" />
                </div>
                
                <div className="flex items-center gap-2 text-gray-400">
                    {playlist.isPrivate ? (
                        <Lock className="h-4 w-4" title="Private Playlist" />
                    ) : (
                        <Globe className="h-4 w-4" title="Public Playlist" />
                    )}
                    <button className="rounded-full p-1 hover:bg-gray-100 hover:text-gray-900">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Playlist Info */}
            <div className="mt-4">
                <Link to={`/playlists/${playlist._id}`}>
                    <h3 className="line-clamp-1 text-lg font-bold text-gray-900 hover:text-blue-600">
                        {playlist.name}
                    </h3>
                </Link>
                {playlist.shortNotes && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {playlist.shortNotes}
                    </p>
                )}
            </div>

            {/* Footer: Date and Owner */}
            <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500">
                <span>
                    Created {new Date(playlist.createdAt).toLocaleDateString()}
                </span>
                
                {/* If owner object is populated, show it */}
                {playlist.owner?.userName && (
                    <Link to={`/profile/${playlist.owner.userName}`} className="font-medium hover:text-blue-600">
                        @{playlist.owner.userName}
                    </Link>
                )}
            </div>
        </div>
    );
}