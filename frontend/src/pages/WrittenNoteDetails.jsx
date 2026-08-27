import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, FileText, Loader2 } from "lucide-react";
import { getBlog } from "../services/blog.service";
import { EmptyState, Button } from "../components";

export default function WrittenNoteDetails() {
    const { blogId } = useParams();
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState("");
    useEffect(() => { getBlog(blogId).then(setBlog).catch((err) => setError(err.message)); }, [blogId]);
    if (error) return <EmptyState title="Written note not found" description={error} />;
    if (!blog) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-9 w-9 animate-spin text-blue-600" /></div>;
    if (blog.pdfStatus !== "READY") return <EmptyState icon={FileText} title="PDF is being prepared" description="The owner has saved this note, but its PDF is not ready yet. Please check again shortly." />;
    return <div className="mx-auto max-w-4xl pb-12"><div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"><h1 className="text-3xl font-bold text-gray-900">{blog.title}</h1>{blog.description && <p className="mt-2 text-gray-600">{blog.description}</p>}<p className="mt-4 text-sm text-gray-500">Written by @{blog.owner?.userName}</p></div><div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-900 shadow-sm"><iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(blog.pdf.url)}&embedded=true`} title={blog.title} className="h-[70vh] w-full bg-white" /><div className="flex justify-end p-3"><a href={blog.pdf.url} target="_blank" rel="noreferrer"><Button className="flex items-center gap-2"><Download className="h-4 w-4" /> Download PDF</Button></a></div></div></div>;
}
