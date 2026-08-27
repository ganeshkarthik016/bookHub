import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "", trim: true },
        content: { type: String, required: true },
        pdf: {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" },
        },
        pdfStatus: {
            type: String,
            enum: ["PENDING", "PROCESSING", "READY", "FAILED"],
            default: "PENDING",
        },
        contentVersion: { type: Number, default: 1 },
        generatedVersion: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
