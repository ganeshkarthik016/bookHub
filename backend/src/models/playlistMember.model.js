import mongoose from "mongoose";

const playlistMemberSchema = new mongoose.Schema(
    {
        playlist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Playlist",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        role: {
            type: String,
            enum: [
                "EDITOR",
                "VIEWER"
            ],
            default: "VIEWER"
        }
    },
    {
        timestamps: true
    });

playlistMemberSchema.index(
    {
        playlist: 1,
        user: 1
    },
    {
        unique: true
    });

export const PlaylistMember = mongoose.model("PlaylistMember", playlistMemberSchema);