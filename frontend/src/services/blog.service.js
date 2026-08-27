import api from "./api.js";
import { apiError } from "../utils/apiError.js";

const handleError = (error) => {
    throw new apiError(error.response?.status || 500, error.response?.data?.message || "Something went wrong", error.response?.data?.errors || []);
};

export const createBlog = async (data) => {
    try { return (await api.post("/blogs", data)).data.data; }
    catch (error) { handleError(error); }
};
export const updateBlog = async (blogId, data) => {
    try { return (await api.patch(`/blogs/${blogId}`, data)).data.data; }
    catch (error) { handleError(error); }
};
export const getMyBlogs = async () => {
    try { return (await api.get("/blogs")).data.data; }
    catch (error) { handleError(error); }
};
export const getBlog = async (blogId) => {
    try { return (await api.get(`/blogs/${blogId}`)).data.data; }
    catch (error) { handleError(error); }
};
export const deleteBlog = async (blogId) => {
    try { return (await api.delete(`/blogs/${blogId}`)).data.data; }
    catch (error) { handleError(error); }
};
