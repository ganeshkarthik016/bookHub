import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: [
                "FOLLOW",
                "PLAYLIST_SHARED",
                "PLAYLIST_ROLE_UPDATED",
                "PLAYLIST_REMOVED",
                "LIKE",
                "COMMENT"
            ],
            required: true
        },

        title: String,

        message: String,

        referenceId: {
            type: mongoose.Schema.Types.ObjectId
        },

        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    });


export const Notification = mongoose.model("Notification", notificationSchema);