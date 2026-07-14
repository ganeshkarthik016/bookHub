import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        note: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note",
            required: true
        }
    },
    {
        timestamps: true
    });

likeSchema.index(
    {
        user: 1,
        note: 1
    },
    {
        unique: true
    });

export const Like = mongoose.model("Like", likeSchema);