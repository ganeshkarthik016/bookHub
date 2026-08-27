import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Loader2 } from "lucide-react";
import { closeModal } from "../../store/slices/uiSlice.js";
import { createBlog } from "../../services/blog.service.js";
import Modal from "../ui/Modal.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

export default function WriteNoteModal() {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.ui.activeModal === "WRITE_NOTE");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const publish = async (event) => {
        event.preventDefault();
        if (!title.trim() || !content.trim()) return setError("Title and written content are required.");
        setIsSaving(true); setError("");
        try {
            await createBlog({ title, description, content });
            setTitle(""); setDescription(""); setContent("");
            dispatch(closeModal());
        } catch (err) { setError(err.message || "Could not save written note."); }
        finally { setIsSaving(false); }
    };

    return <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} title="Write a New Note" maxWidth="max-w-3xl">
        <form onSubmit={publish} className="flex flex-col gap-4">
            {error && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            <Input label="Title *" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Advanced Data Structures" />
            <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary" />
            <div><label className="mb-1 block text-sm font-medium text-gray-700">Written content *</label><textarea value={content} onChange={(e) => setContent(e.target.value)} rows="14" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Write your note here..." /></div>
            <p className="text-xs text-gray-500">Saving queues PDF generation in the background. The PDF is updated only after you change this content.</p>
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4"><Button type="button" bgColor="bg-gray-100" textColor="text-gray-700" onClick={() => dispatch(closeModal())} disabled={isSaving}>Cancel</Button><Button type="submit" disabled={isSaving} className="flex items-center gap-2">{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}{isSaving ? "Saving..." : "Save & queue PDF"}</Button></div>
        </form>
    </Modal>;
}
