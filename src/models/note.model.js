import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        pdf: {
            url: String,
            publicId: String
        },

        coverImage: {
            url: String,
            publicId: String
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        tags: [String],

        isPrivate: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    });

export const Note = mongoose.model("Note", noteSchema);