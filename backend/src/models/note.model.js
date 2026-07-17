import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        pdf: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },

        coverImage: {
            url: {
                type: String,
                default: "",
            },
            publicId: {
                type: String,
                default: "",
            },
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        tags: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],

        isPrivate: {
            type: Boolean,
            default: false,
            index: true,
        },

        views: {
            type: Number,
            default: 0,
        },

        likesCount: {
            type: Number,
            default: 0,
            index: true,
        },

        downloads: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Useful indexes
noteSchema.index({ owner: 1, createdAt: -1 });
noteSchema.index({ likesCount: -1 });
noteSchema.index({ createdAt: -1 });
noteSchema.index({ tags: 1 });

export const Note = mongoose.model("Note", noteSchema);