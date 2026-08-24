import api from "./api.js";
import { apiError } from "../utils/apiError.js";

const handleError = (error) => {
    throw new apiError(
        error.response?.status || 500,
        error.response?.data?.message || "Something went wrong",
        error.response?.data?.errors || []
    );
};

export const changePassword = async (passwordData) => {
    try {
        const response = await api.patch("/users/change-password", passwordData); 
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const updateAccountDetails = async (details) => {
    try {
        const response = await api.patch("/users/update-account-details", details); 
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const updateProfilePic = async (formData) => {
    try {
        const response = await api.patch("/users/update-profile-pic", formData, { 
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const changeGmail = async (emailData) => {
    try {
        const response = await api.patch("/users/change-gmail", emailData); 
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const deleteAccount = async (passwordData) => {
    try {
        const response = await api.delete("/users/delete-account", { data: passwordData }); 
        return response.data.data;
    } catch (error) { handleError(error); }
};

// OTP Services
export const forgetPasswordGenerateOtp = async (data) => {
    try {
        const response = await api.post("/users/forgot-password-otp", data);
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const verifyResetPasswordOtp = async (data) => {
    try {
        const response = await api.post("/users/verify-reset-password-otp", data); 
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const sendEmailVerificationOtp = async () => {
    try {
        const response = await api.post("/users/send-verification-otp"); 
        return response.data.data;
    } catch (error) { handleError(error); }
};

export const verifyEmailOtp = async (otpData) => {
    try {
        const response = await api.post("/users/verify-email-otp", otpData); 
        return response.data.data;
    } catch (error) { handleError(error); }
};