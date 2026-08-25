import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Loader2, Plus, ListMusic, Edit3, Eye } from "lucide-react";
import { 
    getMyPlaylists, 
    getMyEditorPlaylists, 
    getMyViewerPlaylists 
} from "../services/playlist.service";
import { openModal } from "../store/slices/uiSlice";
import { PlaylistCard, EmptyState, Button } from "../components";

export default function MyPlaylists() {
    const dispatch = useDispatch();
    
    // States for the three different playlist categories
    const [ownedPlaylists, setOwnedPlaylists] = useState([]);
    const [editorPlaylists, setEditorPlaylists] = useState([]);
    const [viewerPlaylists, setViewerPlaylists] = useState([]);
    
    const [activeTab, setActiveTab] = useState("owned"); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAllPlaylists = async () => {
            setIsLoading(true);
            setError("");
            try {
                // Fetch everything concurrently for maximum speed
                const [ownedData, editorData, viewerData] = await Promise.all([
                    getMyPlaylists(),
                    getMyEditorPlaylists(),
                    getMyViewerPlaylists()
                ]);

                if (ownedData) setOwnedPlaylists(ownedData);
                if (editorData) setEditorPlaylists(editorData);
                if (viewerData) setViewerPlaylists(viewerData);
            } catch (err) {
                setError("Failed to load your playlists.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllPlaylists();
    }, []);

    // Helper function to keep our JSX clean when rendering the active grid
    const renderGrid = (playlists, emptyTitle, emptyDesc) => {
        if (playlists.length === 0) {
            return (
                <EmptyState 
                    icon={ListMusic}
                    title={emptyTitle} 
                    description={emptyDesc}
                    // Only show the "Create" button on the owned tab
                    actionText={activeTab === "owned" ? "Create Playlist" : null}
                    onAction={activeTab === "owned" ? () => dispatch(openModal("CREATE_PLAYLIST")) : null}
                />
            );
        }

        return (
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {playlists.map((item) => {
                    // If the backend returns a Share document, the playlist is nested inside item.playlist
                    // If it returns the playlist directly, we just use item.
                    const actualPlaylist = item.playlist || item;
                    return (
                        <PlaylistCard key={actualPlaylist._id} playlist={actualPlaylist} />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="mx-auto w-full pb-12">
            
            {/* Page Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Playlists</h1>
                    <p className="text-sm text-gray-500">Manage your collections and shared collaborations.</p>
                </div>
                
                <Button 
                    onClick={() => dispatch(openModal("CREATE_PLAYLIST"))}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Create Playlist
                </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6 flex gap-6 border-b border-gray-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("owned")}
                    className={`flex items-center gap-2 border-b-2 pb-3 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === "owned" 
                            ? "border-blue-600 text-blue-600" 
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <ListMusic className="h-4 w-4" /> Created by Me ({ownedPlaylists.length})
                </button>
                <button
                    onClick={() => setActiveTab("editor")}
                    className={`flex items-center gap-2 border-b-2 pb-3 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === "editor" 
                            ? "border-blue-600 text-blue-600" 
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <Edit3 className="h-4 w-4" /> Editor Access ({editorPlaylists.length})
                </button>
                <button
                    onClick={() => setActiveTab("viewer")}
                    className={`flex items-center gap-2 border-b-2 pb-3 px-1 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === "viewer" 
                            ? "border-blue-600 text-blue-600" 
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <Eye className="h-4 w-4" /> Viewer Access ({viewerPlaylists.length})
                </button>
            </div>

            {/* Content Area */}
            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                    {error}
                </div>
            ) : isLoading ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="mt-6">
                    {activeTab === "owned" && renderGrid(
                        ownedPlaylists, 
                        "No Playlists Created", 
                        "Group related notes together by creating your first playlist."
                    )}
                    
                    {activeTab === "editor" && renderGrid(
                        editorPlaylists, 
                        "No Editor Playlists", 
                        "No one has invited you to collaborate on a playlist yet."
                    )}
                    
                    {activeTab === "viewer" && renderGrid(
                        viewerPlaylists, 
                        "No Viewer Playlists", 
                        "No one has shared a read-only playlist with you yet."
                    )}
                </div>
            )}
        </div>
    );
}