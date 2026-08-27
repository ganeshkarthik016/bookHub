import { useEffect, useState } from "react";
import { FileText, Loader2, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { getMyBlogs, updateBlog, deleteBlog } from "../services/blog.service";
import { EmptyState, Button, Input } from "../components";

export default function MyWrittenNotes() {
    const [blogs, setBlogs] = useState([]);
    const [selected, setSelected] = useState(null);
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => { getMyBlogs().then(setBlogs).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, []);
    const select = (blog) => { setSelected(blog); setDraft({ title: blog.title, description: blog.description || "", content: blog.content }); };
    const save = async (event) => {
        event.preventDefault(); if (!selected || !draft.title.trim() || !draft.content.trim()) return;
        setSaving(true); setError("");
        try { const updated = await updateBlog(selected._id, draft); setSelected(updated); setDraft({ title: updated.title, description: updated.description || "", content: updated.content }); setBlogs((all) => all.map((blog) => blog._id === updated._id ? updated : blog)); }
        catch (err) { setError(err.message || "Could not save written note."); } finally { setSaving(false); }
    };
    const remove = async (blogId) => { if (!window.confirm("Delete this written note?")) return; try { await deleteBlog(blogId); setBlogs((all) => all.filter((blog) => blog._id !== blogId)); if (selected?._id === blogId) { setSelected(null); setDraft(null); } } catch (err) { setError(err.message || "Could not delete note."); } };
    if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-9 w-9 animate-spin text-blue-600" /></div>;
    return <div className="mx-auto w-full max-w-6xl pb-12"><div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">My Written Notes</h1><p className="text-sm text-gray-500">Edit your original content. Readers only receive the generated PDF.</p></div>{error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}{blogs.length === 0 ? <EmptyState icon={FileText} title="No written notes" description="Use Write Note from My Notes to create your first written note." /> : <div className="grid gap-6 lg:grid-cols-[300px_1fr]"><div className="space-y-3">{blogs.map((blog) => <div key={blog._id} className={`w-full rounded-xl border p-4 text-left ${selected?._id === blog._id ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"}`}><button onClick={() => select(blog)} className="w-full text-left"><div className="flex justify-between gap-2"><h2 className="font-semibold text-gray-900">{blog.title}</h2><Trash2 onClick={(event) => { event.stopPropagation(); remove(blog._id); }} className="h-4 w-4 text-red-500" /></div><p className="mt-1 line-clamp-2 text-xs text-gray-500">{blog.description || "No description"}</p><span className="mt-2 inline-block text-xs text-gray-500">PDF: {blog.pdfStatus.toLowerCase()}</span></button><Link to={`/written-notes/${blog._id}`} className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"><ExternalLink className="h-3 w-3" />View PDF</Link></div>)}</div>{selected && <form onSubmit={save} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"><Input label="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /><div className="mt-4"><Input label="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div><div className="mt-4"><label className="mb-1 block text-sm font-medium text-gray-700">Written content</label><textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} rows="18" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" /></div><div className="mt-4 flex items-center justify-between"><span className="text-xs text-gray-500">PDF status: {selected.pdfStatus.toLowerCase()}</span><Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save & regenerate PDF"}</Button></div></form>}</div>}</div>;
}
