import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Loader2, Plus, FileText } from "lucide-react";
import { getMyNotes } from "../services/note.service";
import { openModal } from "../store/slices/uiSlice";
import { NoteCard, EmptyState, Button } from "../components";

export default function MyNotes() {
    const dispatch = useDispatch();
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNotes = async () => {
            setIsLoading(true);
            try {
                const data = await getMyNotes({ page: 1, limit: 50 });
                if (data?.notes) {
                    setNotes(data.notes);
                }
            } catch {
                setError("Failed to load your notes.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotes();
    }, []);

    return (
        <div className="mx-auto w-full pb-12">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
                    <p className="text-sm text-gray-500">Manage all the study materials you've uploaded.</p>
                </div>
                
                <div className="flex gap-3">
                    <Button 
                        onClick={() => dispatch(openModal("WRITE_NOTE"))}
                        bgColor="bg-white border border-gray-300" 
                        textColor="text-gray-700 hover:bg-gray-50"
                        className="flex items-center gap-2"
                    >
                        <FileText className="h-4 w-4" /> Write Note
                    </Button>
                    <Button 
                        onClick={() => dispatch(openModal("UPLOAD_NOTE"))}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" /> Upload PDF
                    </Button>
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
                    icon={FileText}
                    title="No Notes Uploaded" 
                    description="You haven't uploaded or written any notes yet. Start sharing your knowledge!"
                    actionText="Upload Your First Note"
                    onAction={() => dispatch(openModal("UPLOAD_NOTE"))}
                />
            ) : (
                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {notes.map((note) => (
                        <NoteCard key={note._id} note={note} />
                    ))}
                </div>
            )}
        </div>
    );
}