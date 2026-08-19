import api from "./api.js";

export const getNoteComments = async (noteId, page = 1) => {
    const response = await api.get(`/comments/get-comments/${noteId}?page=${page}`);
    return response.data.data;
};
export const addComment = async (noteId, text) => {
    const response = await api.post(`/comments/add-comment/${noteId}`, { text });
    return response.data.data;
};
export const deleteMyComment = async (commentId) => {
    const response = await api.delete(`/comments/delete-comment/${commentId}`);
    return response.data.data;
};