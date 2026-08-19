import api from "./api.js";
import { apiError } from "../utils/apiError.js";

const handleError = (error) => {
    throw new apiError(error.response?.status || 500, error.response?.data?.message || "Something went wrong", error.response?.data?.errors || []);
};

export const toggleLike = async (noteId) => {
    try {
        const response = await api.post(`/likes/toggle/${noteId}`); //[cite: 39]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getUserLikes = async (params = { page: 1, limit: 10 }) => {
    try {
        const response = await api.get("/likes/my-likes", { params }); //[cite: 39]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const isLiked = async (noteId) => {
    try {
        const response = await api.get(`/likes/is-liked/${noteId}`); //[cite: 39]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getNoteLikes = async (noteId) => {
    try {
        const response = await api.get(`/likes/note/${noteId}`); //[cite: 39]
        return response.data.data;
    } catch (error) { handleError(error); }
};