import { apiError } from "./utils/apiError.js";
import dotenv from "dotenv";

dotenv.config();

export const DB_NAME = process.env.DB_NAME || "notesdb";
export const PORT = Number(process.env.PORT) || 8000;
export const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

export const CORS_ORIGIN =
    process.env.CORS_ORIGIN || "http://localhost:3000";

const requiredEnv = [
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new apiError(400, "message : Missing required environment variabe: " + key);
    }
}

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const ACCESS_TOKEN_EXPIRY =
    process.env.ACCESS_TOKEN_EXPIRY || "15m";
export const REFRESH_TOKEN_EXPIRY =
    process.env.REFRESH_TOKEN_EXPIRY || "30d";

export const CLOUDINARY_CLOUD_NAME =
    process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY =
    process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET =
    process.env.CLOUDINARY_API_SECRET;