import mongoose from "mongoose";

const playlistItemSchema = new mongoose.Schema(
    {
        playlist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Playlist",
            required: true,
            index: true
        },

        note: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note",
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    });

playlistItemSchema.index(
    {
        playlist: 1,
        note: 1
    },
    {
        unique: true
    });

export const PlaylistItem = mongoose.model(
    "PlaylistItem",
    playlistItemSchema
);