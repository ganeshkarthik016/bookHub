import axios from "axios";
import conf from "../conf/conf.js";

const api = axios.create({
    baseURL: conf.apiURL,
    withCredentials: true,
});

let isRefreshing = false;
let waitingRequests = [];

const processQueue = (error) => {
    waitingRequests.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });

    waitingRequests = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url?.includes("/refresh-token")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                waitingRequests.push({
                    resolve,
                    reject,
                });
            }).then(() => api(originalRequest));
        }

        isRefreshing = true;

        try {
            await api.post("/users/refresh-token");

            processQueue(null);

            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;