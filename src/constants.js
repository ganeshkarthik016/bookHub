import { apiError } from "./utils/apiError.js";
import dotenv from "dotenv";
dotenv.config();

export const DB_NAME = process.env.DB_NAME || "notesdb";
export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new apiError("ACCESS_TOKEN_SECRET is missing");
}
if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new apiError("REFRESH_TOKEN_SECRET is missing");
}
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "30d";