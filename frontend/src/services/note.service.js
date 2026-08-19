import api from "./api.js";
import { apiError } from "../utils/apiError.js";

const handleError = (error) => {
    throw new apiError(
        error.response?.status || 500,
        error.response?.data?.message || "Something went wrong",
        error.response?.data?.errors || []
    );
};

const uploadNotes = async (formData) => {
    try {
        const response = await api.post("/notes/upload-notes", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

const updateNoteDetails = async (noteId, noteData) => {
    try {
        const response = await api.patch(`/notes/update-note-details/${noteId}`, noteData);
        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

const updateNoteFiles = async (noteId, formData) => {
    try {
        const response = await api.patch(`/notes/update-note/${noteId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

const getCurrentNote = async (noteId) => {
    try {
        const response = await api.get(`/notes/get-current-note/${noteId}`);
        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

const getMyNotes = async (params = { page: 1, limit: 10, sort: "newest" }) => {
    try {
        const response = await api.get("/notes/get-my-notes", { params });
        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

const getUserNotes = async (userName, params = { page: 1, limit: 10, sort: "newest" }) => {
    try {
        const response = await api.get(`/notes/get-user-notes/${userName}`, { params });
        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

const searchNotes = async (params = { search: "", tag: "", page: 1, limit: 10, sort: "newest" }) => {
    try {
        const response = await api.get("/notes/search-notes", { params });
        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

const downloadNote = async (noteId) => {
    try {
        const response = await api.get(`/notes/download-note/${noteId}`);
        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

const deleteNote = async (noteId) => {
    try {
        const response = await api.delete(`/notes/delete-note/${noteId}`);
        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

export {
    uploadNotes,
    updateNoteDetails,
    updateNoteFiles,
    getCurrentNote,
    getMyNotes,
    getUserNotes,
    searchNotes,
    downloadNote,
    deleteNote,
};