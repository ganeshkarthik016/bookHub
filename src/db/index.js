import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${MONGODB_URI}/${DB_NAME}`
        );

        console.log(
            `✅ MongoDB Connected: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1);
    }
};

export { connectDB };