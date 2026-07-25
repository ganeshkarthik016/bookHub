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
            required: true,
            index: true
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

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId
        },

        isRead: {
            type: Boolean,
            default: false,
            index: true
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.index({
    receiver: 1,
    createdAt: -1
});

export const Notification = mongoose.model("Notification", notificationSchema);