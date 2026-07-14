import mongoose from "mongoose";

const saveSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        note: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate saves
saveSchema.index(
    { user: 1, note: 1 },
    { unique: true }
);

export const Save = mongoose.model("Save", saveSchema);