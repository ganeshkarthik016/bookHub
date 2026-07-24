import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {

    }
);


export const Notification = mongoose.model("Notification", notificationSchema);