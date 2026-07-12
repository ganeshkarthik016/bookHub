import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        isPinned: {
            type: Boolean,
            default: false,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Note = mongoose.model("Note", noteSchema);