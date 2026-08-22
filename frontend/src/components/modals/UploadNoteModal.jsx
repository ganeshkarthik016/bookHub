import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../store/slices/uiSlice.js";
import { addNoteToTop } from "../../store/slices/noteSlice.js";
import { UploadCloud, Loader2 } from "lucide-react";
import Modal from "./Modal.jsx";
import Input from "./Input.jsx";
import Button from "./Button.jsx";
import { uploadNotes } from "../../services/note.service.js";

export default function UploadNoteModal() {
    const dispatch = useDispatch();
    const { activeModal } = useSelector((state) => state.ui);
    const isOpen = activeModal === "UPLOAD_NOTE";

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) return setError("Title is required");
        if (!pdfFile) return setError("Please select a PDF file to upload");

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("isPrivate", isPrivate);
            formData.append("noteFile", pdfFile);
            if (coverImage) formData.append("coverImage", coverImage);

            // Execute the API call using your exact service
            const response = await uploadNotes(formData);
            
            // Instantly add it to the top of the feed if successful
            if (response) {
                dispatch(addNoteToTop(response));
            }

            // Reset form and close modal
            setTitle("");
            setDescription("");
            setIsPrivate(false);
            setPdfFile(null);
            setCoverImage(null);
            dispatch(closeModal());
            
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to upload note");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => dispatch(closeModal())} 
            title="Upload Note PDF"
            maxWidth="max-w-xl"
        >
            <form onSubmit={handleUpload} className="flex flex-col gap-4">
                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                <Input
                    label="Title *"
                    placeholder="e.g., Operating Systems Chapter 1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <Input
                    label="Description"
                    placeholder="Brief summary of this note..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">PDF File *</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setPdfFile(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700">Cover Image (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                            className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                        />
                    </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="uploadPrivate"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="uploadPrivate" className="text-sm font-medium text-gray-700">
                        Make this note private
                    </label>
                </div>

                <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <Button 
                        bgColor="bg-gray-100" 
                        textColor="text-gray-700"
                        onClick={() => dispatch(closeModal())}
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={isUploading}
                        className="flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="h-4 w-4" />
                                Upload Note
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}