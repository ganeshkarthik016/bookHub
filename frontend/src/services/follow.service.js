import api from "./api.js";
import { apiError } from "../utils/apiError.js";

const handleError = (error) => {
    throw new apiError(error.response?.status || 500, error.response?.data?.message || "Something went wrong", error.response?.data?.errors || []);
};

export const toggleFollow = async (userId) => {
    try {
        const response = await api.post(`/follows/toggle/${userId}`); //[cite: 38]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const isFollowing = async (userId) => {
    try {
        const response = await api.get(`/follows/is-following/${userId}`); //[cite: 38]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getFollowers = async (userId, page = 1) => {
    try {
        const response = await api.get(`/follows/followers/${userId}?page=${page}`); //[cite: 38]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getFollowing = async (userId, page = 1) => {
    try {
        const response = await api.get(`/follows/following/${userId}?page=${page}`); //[cite: 38]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getMyFriends = async (page = 1) => {
    try {
        const response = await api.get(`/follows/my-friends?page=${page}`); //[cite: 38]
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const getSuggestions = async (page = 1) => {
    try {
        const response = await api.get(`/follows/suggestions?page=${page}`); //[cite: 38]
        return response.data.data;
    } catch (error) { handleError(error); }
};