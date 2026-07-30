import rateLimit from "express-rate-limit";

const options = {
    standardHeaders: true,
    legacyHeaders: false,
};

export const loginLimiter = rateLimit({
    ...options,
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts. Please try again after 15 minutes."
    }
});

export const registerLimiter = rateLimit({
    ...options,
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: "Too many registration attempts. Please try again later."
    }
});

export const otpLimiter = rateLimit({
    ...options,
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: "Too many OTP requests. Please try again later."
    }
});

export const uploadLimiter = rateLimit({
    ...options,
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many upload requests. Please try again later."
    }
});

export const interactionLimiter = rateLimit({
    ...options,
    windowMs: 60 * 1000,
    max: 60,
    message: {
        success: false,
        message: "Too many requests. Slow down."
    }
});