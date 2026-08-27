import api from "./api.js";

import { apiError } from "../utils/apiError.js";

const handleError = (error) => {
    throw new apiError(
        error.response?.status || 500,
        error.response?.data?.message ||
            "Something went wrong",
        error.response?.data?.errors || []
    );
};

const loginUser = async (credentials) => {
    try {
        const response = await api.post(
            "/users/login",
            credentials
        );

        return response.data.data.user;
    } catch (error) {
        handleError(error);
    }
};

const registerUser = async (userData) => {
    try {
        const response = await api.post(
            "/users/register",
            userData
        );

        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

const logoutUser = async () => {
    try {
        const response = await api.post(
            "/users/logout"
        );

        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

const getCurrentUser = async () => {
    try {
        const response = await api.get(
            "/users/get-current-user"
        );

        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

const searchUsersCall = async (searchQuery) => {
    try {
        const response = await api.get("/users/search", {
            params: { query: searchQuery }
        });
        return response.data.data;
    } catch (error) {
        handleError(error);
    }
};

export {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser,
    searchUsersCall,
};
