import api from "./api";

export const loginUser = async (credentials) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
};

export const registerUser = async (data) => {
    const response = await api.post("/users/register", data);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/users/get-current-user");
    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post("/users/logout");
    return response.data;
};