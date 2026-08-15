import api from "./api";

export const getMyNotes = (params = {}) => api.get("/notes/get-my-notes", { params });
export const uploadNote = (formData) => api.post("/notes/upload-notes", formData);
export const deleteNote = (noteId) => api.delete(`/notes/delete-note/${noteId}`);
export const downloadNote = (noteId) => api.get(`/notes/download-note/${noteId}`);
export const searchNotes = (params) => api.get("/notes/search-notes", { params });
