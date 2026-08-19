import api from "./api.js";
import { apiError } from "../utils/apiError.js";

const handleError = (error) => {
    throw new apiError(error.response?.status || 500, error.response?.data?.message || "Something went wrong", error.response?.data?.errors || []);
};

export const addComment = async (noteId, text) => {
    try {
        const response = await api.post(`/comments/add-comment/${noteId}`, { text }); //[cite: 37]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getNoteComments = async (noteId, page = 1) => {
    try {
        const response = await api.get(`/comments/get-comments/${noteId}?page=${page}`); //[cite: 37]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const editMyComment = async (commentId, text) => {
    try {
        const response = await api.patch(`/comments/edit-comment/${commentId}`, { text }); //[cite: 37]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const deleteMyComment = async (commentId) => {
    try {
        const response = await api.delete(`/comments/delete-comment/${commentId}`); //[cite: 37]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getMyComments = async (page = 1, limit = 10) => {
    try {
        const response = await api.get("/comments/get-my-comments", { params: { page, limit } }); //[cite: 37]
        return response.data.data;
    } catch (error) { handleError(error); }
};