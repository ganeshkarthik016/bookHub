import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import html2pdf from "html2pdf.js";
import { closeModal } from "../store/slices/uiSlice";
import { addNoteToTop } from "../store/slices/noteSlice"; 
import { FileText, Loader2 } from "lucide-react";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { uploadNotes } from "../services/note.service";

export default function WriteNoteModal() {
    const dispatch = useDispatch();
    const { activeModal } = useSelector((state) => state.ui);
    const isOpen = activeModal === "WRITE_NOTE";
    
    const editorRef = useRef(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState("");

    const handlePublish = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            return setError("Title is required");
        }

        if (!editorRef.current || !editorRef.current.getContent()) {
            return setError("Note content cannot be empty");
        }

        setIsPublishing(true);

        try {
            const htmlContent = editorRef.current.getContent();

            // 1. Create a temporary hidden div for html2pdf
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.padding = "20px"; 
            tempDiv.style.fontFamily = "sans-serif";

            // 2. Configure PDF options
            const opt = {
                margin: 10,
                filename: `${title.replace(/\s+/g, '_')}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // 3. Generate the PDF Blob
            const pdfBlob = await html2pdf().set(opt).from(tempDiv).output('blob');

            // 4. Attach to FormData just like a regular file upload
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("isPrivate", isPrivate);
            formData.append("noteFile", pdfBlob, `${title}.pdf`); 

            // 5. Send to backend via the exact service
            const response = await uploadNotes(formData);
            
            // 6. Push to Redux feed
            if (response) {
                dispatch(addNoteToTop(response));
            }
            
            // 7. Cleanup and close
            setTitle("");
            setDescription("");
            setIsPrivate(false);
            if (editorRef.current) editorRef.current.setContent("");
            dispatch(closeModal());

        } catch (err) {
            console.error(err);
            setError("Something went wrong while generating the PDF.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => dispatch(closeModal())} 
            title="Write a New Note" 
            maxWidth="max-w-4xl"
        >
            <form onSubmit={handlePublish} className="flex flex-col gap-4">
                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                        label="Title *"
                        placeholder="e.g., Advanced Data Structures"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Input
                        label="Description"
                        placeholder="Brief summary of this note..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="mt-2 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="writePrivate"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="writePrivate" className="text-sm font-medium text-gray-700">
                        Make this note private
                    </label>
                </div>

                {/* TinyMCE Editor */}
                <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                    <Editor
                        apiKey="YOUR_TINYMCE_API_KEY" // Make sure to swap this!
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue="<p>Start writing your notes here...</p>"
                        init={{
                            height: 400,
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                </div>

                <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <Button 
                        bgColor="bg-gray-100" 
                        textColor="text-gray-700"
                        onClick={() => dispatch(closeModal())}
                        disabled={isPublishing}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={isPublishing}
                        className="flex items-center gap-2"
                    >
                        {isPublishing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating PDF...
                            </>
                        ) : (
                            <>
                                <FileText className="h-4 w-4" />
                                Save & Publish
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}