import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Users, FileText, Search as SearchIcon } from "lucide-react";
import { searchNotes } from "../services/note.service";
import { searchUsersCall } from "../services/auth.service";
import { NoteCard, UserCard, EmptyState, Input, Button } from "../components";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [activeTab, setActiveTab] = useState("notes");
    const [searchInput, setSearchInput] = useState(query);
    
    const [notes, setNotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!query.trim()) return;

        const fetchResults = async () => {
            setIsLoading(true);
            setError("");
            try {
                // Fire both searches concurrently for speed
                const [notesData, usersData] = await Promise.all([
                    searchNotes({ search: query, limit: 20 }),
                    searchUsersCall(query)
                ]);

                if (notesData?.notes) setNotes(notesData.notes);
                if (usersData) setUsers(usersData);
            } catch {
                setError("Failed to fetch search results.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ q: searchInput.trim() });
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl pb-12">
            {/* Search Header Form */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <form onSubmit={handleSearchSubmit} className="flex items-end gap-3">
                    <div className="flex-1">
                        <Input
                            label="Search BookHub"
                            placeholder="Search for notes, tags, or users..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={!searchInput.trim()} className="h-[42px] px-6">
                        <SearchIcon className="h-5 w-5" />
                    </Button>
                </form>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("notes")}
                    className={`flex items-center gap-2 border-b-2 pb-3 px-1 text-sm font-medium transition-colors ${
                        activeTab === "notes" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <FileText className="h-4 w-4" /> Notes ({notes.length})
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`flex items-center gap-2 border-b-2 pb-3 px-1 text-sm font-medium transition-colors ${
                        activeTab === "users" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    <Users className="h-4 w-4" /> Users ({users.length})
                </button>
            </div>

            {/* Results Area */}
            {isLoading ? (
                <div className="flex min-h-[30vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : error ? (
                <div className="rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">{error}</div>
            ) : !query ? (
                <EmptyState icon={SearchIcon} title="Start Searching" description="Type a keyword above to find notes and users." />
            ) : (
                <div className="mt-6">
                    {/* Notes Tab */}
                    {activeTab === "notes" && (
                        notes.length > 0 ? (
                            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                                {notes.map((note) => <NoteCard key={note._id} note={note} />)}
                            </div>
                        ) : (
                            <EmptyState title="No Notes Found" description={`We couldn't find any notes matching "${query}".`} />
                        )
                    )}

                    {/* Users Tab */}
                    {activeTab === "users" && (
                        users.length > 0 ? (
                            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                                {users.map((user) => <UserCard key={user._id} user={user} />)}
                            </div>
                        ) : (
                            <EmptyState icon={Users} title="No Users Found" description={`We couldn't find anyone named "${query}".`} />
                        )
                    )}
                </div>
            )}
        </div>
    );
}