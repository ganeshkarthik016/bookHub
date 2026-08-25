import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Loader2, FileText, ListMusic, MapPin, Link as LinkIcon, Calendar } from "lucide-react";
import { getUserProfile } from "../services/user.service";
import { getUserNotes } from "../services/note.service";
import { getUserPlaylists } from "../services/playlist.service";
import { openModal } from "../store/slices/uiSlice";
import { NoteCard, PlaylistCard, FollowButton, EmptyState, Button } from "../components";

export default function Profile() {
    const { userName } = useParams();
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);

    const [profile, setProfile] = useState(null);
    const [notes, setNotes] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    
    const [activeTab, setActiveTab] = useState("notes"); // 'notes' or 'playlists'
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Check if the current logged-in user is viewing their own profile
    const isOwnProfile = currentUser?.userName === userName;

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            setError("");
            try {
                // 1. Fetch the user's basic profile stats
                const profileData = await getUserProfile(userName);
                if (profileData) setProfile(profileData);

                // 2. Fetch their public notes and playlists concurrently
                const [notesData, playlistsData] = await Promise.all([
                    getUserNotes(userName),
                    getUserPlaylists(userName)
                ]);

                if (notesData?.notes) setNotes(notesData.notes);
                if (playlistsData) setPlaylists(playlistsData);

            } catch (err) {
                setError(err.message || "User not found.");
            } finally {
                setIsLoading(false);
            }
        };

        if (userName) fetchProfileData();
    }, [userName]);

    if (isLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="mt-10">
                <EmptyState 
                    title="Profile Not Found" 
                    description={error || "The user you are looking for doesn't exist."} 
                />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl pb-12">
            {/* --- PROFILE HEADER --- */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Cover Banner (Static color for now, could be dynamic later) */}
                <div className="h-32 w-full bg-gradient-to-r from-blue-400 to-blue-600 sm:h-48"></div>
                
                <div className="px-4 pb-6 sm:px-8">
                    <div className="relative flex justify-between">
                        {/* Avatar (Overlapping the banner) */}
                        <div className="-mt-12 sm:-mt-16">
                            <img 
                                src={profile.profilePic?.url || "https://via.placeholder.com/150"} 
                                alt={profile.userName}
                                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm sm:h-32 sm:w-32"
                            />
                        </div>

                        {/* Action Button (Edit Profile OR Follow) */}
                        <div className="mt-4">
                            {isOwnProfile ? (
                                <div className="flex gap-2">
                                    <Button 
                                        bgColor="bg-gray-100" 
                                        textColor="text-gray-800" 
                                        onClick={() => dispatch(openModal("EDIT_PROFILE"))}
                                    >
                                        Edit Profile
                                    </Button>
                                    {/* Trigger for the dangerous delete modal */}
                                    <Button 
                                        bgColor="bg-red-50 hover:bg-red-100" 
                                        textColor="text-red-600" 
                                        onClick={() => dispatch(openModal("DELETE_ACCOUNT"))}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ) : (
                                <FollowButton userId={profile._id} initialIsFollowing={profile.isFollowing} />
                            )}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="mt-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {profile.userFullName || profile.userName}
                        </h1>
                        <p className="text-sm font-medium text-gray-500">@{profile.userName}</p>
                        
                        {profile.bio && (
                            <p className="mt-3 max-w-2xl text-sm text-gray-700 whitespace-pre-wrap">
                                {profile.bio}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-gray-900">{profile.followersCount}</span> Followers
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-gray-900">{profile.followingCount}</span> Following
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                Joined {new Date(profile.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT TABS --- */}
            <div className="mt-6 flex gap-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("notes")}
                    className={`flex items-center gap-2 border-b-2 pb-3 px-1 text-sm font-medium transition-colors ${
                        activeTab === "notes" 
                            ? "border-blue-600 text-blue-600" 
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <FileText className="h-4 w-4" /> Notes ({notes.length})
                </button>
                <button
                    onClick={() => setActiveTab("playlists")}
                    className={`flex items-center gap-2 border-b-2 pb-3 px-1 text-sm font-medium transition-colors ${
                        activeTab === "playlists" 
                            ? "border-blue-600 text-blue-600" 
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <ListMusic className="h-4 w-4" /> Playlists ({playlists.length})
                </button>
            </div>

            {/* --- TAB CONTENT --- */}
            <div className="mt-6">
                {activeTab === "notes" && (
                    notes.length > 0 ? (
                        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                            {notes.map((note) => (
                                <NoteCard key={note._id} note={note} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            title="No Notes" 
                            description={isOwnProfile ? "You haven't uploaded any public notes yet." : "This user has no public notes."} 
                            actionText={isOwnProfile ? "Upload Note" : null}
                            onAction={() => dispatch(openModal("UPLOAD_NOTE"))}
                        />
                    )
                )}

                {activeTab === "playlists" && (
                    playlists.length > 0 ? (
                        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {playlists.map((playlist) => (
                                <PlaylistCard key={playlist._id} playlist={playlist} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            title="No Playlists" 
                            description={isOwnProfile ? "You haven't created any public playlists." : "This user has no public playlists."} 
                            actionText={isOwnProfile ? "Create Playlist" : null}
                            onAction={() => dispatch(openModal("CREATE_PLAYLIST"))}
                        />
                    )
                )}
            </div>
        </div>
    );
}