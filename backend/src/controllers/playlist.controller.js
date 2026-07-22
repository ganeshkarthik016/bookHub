import { Playlist } from "../models/playlist.model.js";
import { PlaylistItem } from "../models/playlistItem.model.js";
import { PlaylistMember } from "../models/playlistMember.model.js";
import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

//usefull function
const isAuthorizedEditor = async (playlistId, userId) => {
    const member = await PlaylistMember.findOne({
        playlist: playlistId,
        user: userId,
        role: "EDITOR"
    });
    return !!member;
};

const isAuthorizedViewer = async (playlistId, userId) => {
    const member = await PlaylistMember.findOne({
        playlist: playlistId,
        user: userId,
        role: "VIEWER"
    });
    const isEditor = await isAuthorizedEditor(playlistId, userId);
    return (isEditor || !!member);
};

//post
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, isPrivate, shortNotes } = req.body;

    if (!name || name.trim() === "") {
        throw new apiError(400, "Name is required");
    }

    const exists = await Playlist.findOne({
        owner: req.user._id,
        name: name.trim()
    });

    if (exists) {
        throw new apiError(400, "Playlist already exists");
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        owner: req.user._id,
        shortNotes: shortNotes,
        isPrivate: isPrivate === true || isPrivate === "true",
    });

    return res.status(201).json(
        new apiResponse(
            201,
            playlist,
            "Playlist created successfully"
        )
    );
});

const addToPlatlistToggel = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { noteId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    const note = await Note.findById(noteId);
    if (!note) {
        throw new apiError(404, "Note not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        const isEditor = await isAuthorizedEditor(playlistId, req.user._id);
        if (!isEditor) {
            throw new apiError(403, "You do not have permission to edit this playlist");
        }
    }

    const alreadyExists = await PlaylistItem.findOne({
        playlist: playlistId,
        note: noteId,
    });

    if (alreadyExists) {
        await alreadyExists.deleteOne();

        return res.status(200).json(
            new apiResponse(
                200,
                { isAdded: false },
                "Note removed from playlist successfully"
            )
        );
    } else {
        const lastItem = await PlaylistItem.findOne({
            playlist: playlistId,
        }).sort({ order: -1 });

        const nextOrder = lastItem ? lastItem.order + 1 : 1;

        await PlaylistItem.create({
            playlist: playlistId,
            note: noteId,
            order: nextOrder
        });

        return res.status(201).json(
            new apiResponse(
                200,
                { isAdded: true },
                "Note added to playlist successfully"
            )
        );
    }
});

//get
const getPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.isPrivate && playlist.owner.toString() !== req.user._id.toString()) {
        const isMember = await PlaylistMember.findOne({
            playlist: playlistId,
            user: req.user._id
        });

        if (!isMember) {
            throw new apiError(403, "Unauthorized to view this playlist");
        }
    }

    return res.status(200).json(
        new apiResponse(
            200,
            playlist
                .populate(
                    "owner",
                    "userName userFullName profilePic"
                ),
            "Playlist fetched successfully"
        )
    );
});

const getMyPlaylists = asyncHandler(async (req, res) => {
    const playlists = await Playlist.find({
        owner: req.user._id
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(
            200,
            playlists,
            "Playlists fetched successfully"
        )
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userName } = req.params;

    const user = await User.findOne({
        userName: userName?.trim().toLowerCase()
    });

    if (!user) {
        throw new apiError(404, "User not found");
    }

    const playlists = await Playlist.find({
        owner: user._id,
        isPrivate: false
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new apiResponse(
            200,
            playlists,
            "Playlists fetched successfully"
        )
    );
});

//  For the Instagram-style modal
const getUserPlaylistsWithNoteStatus = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);
    if (!note) {
        throw new apiError(404, "Note not found");
    }

    // Fetch all playlists owned by the user
    const playlists = await Playlist.find({
        owner: req.user._id
    }).sort({ createdAt: -1 });

    const playlistIds = playlists.map(p => p._id);
    const presentItems = await PlaylistItem.find({
        note: noteId,
        playlist: { $in: playlistIds }
    });


    const presentSet = new Set(presentItems.map(item => item.playlist.toString()));

    const playlistsWithStatus = playlists.map(playlist => ({
        _id: playlist._id,
        name: playlist.name,
        isPrivate: playlist.isPrivate,
        isPresent: presentSet.has(playlist._id.toString())
    }));

    return res.status(200).json(
        new apiResponse(
            200,
            playlistsWithStatus,
            "Playlists status fetched successfully"
        )
    );
});


const getPlaylistItems = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.isPrivate && playlist.owner.toString() !== req.user._id.toString()) {
        const isMember = await PlaylistMember.findOne({
            playlist: playlistId,
            user: req.user._id
        });

        if (!isMember) {
            throw new apiError(403, "Unauthorized to view these notes");
        }
    }

    const playlistItems = await PlaylistItem.find({ playlist: playlistId })
        .populate(
            "note",
            "title coverImage owner likesCount views downloads"
        )
        .sort({ order: 1 });

    return res.status(200).json(
        new apiResponse(
            200,
            playlistItems,
            "Playlist items fetched successfully"
        )
    );
});

const isNotePresentInPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { noteId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }
    const note = await Note.findById(noteId);
    if (!note) {
        throw new apiError(404, "Note not found");
    }
    if (
        playlist.isPrivate &&
        playlist.owner.toString() !== req.user._id.toString() &&
        !(await isAuthorizedViewer(playlistId, req.user._id))) {
        throw new apiError(403, "You are not authorized to view this playlist");
    }

    const isPresent = await PlaylistItem.findOne({
        playlist: playlistId,
        note: noteId,
    });

    return res.status(200).json(
        new apiResponse(
            200,
            { isPresent: !!isPresent },
            "Status fetched successfully"
        )
    );
});

//edit / patch
const editPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, isPrivate, shortNotes } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to edit this playlist");
    }

    const exists = await Playlist.findOne({
        owner: req.user._id,
        name: name?.trim(),
        _id: { $ne: playlistId }
    });
    if (exists) {
        throw new apiError(400, "Playlist name already exists");
    }

    if (name) {
        playlist.name = name.trim();
    }
    if (shortNotes !== undefined) {
        playlist.shortNotes = shortNotes.trim();
    }
    if (isPrivate !== undefined) {
        playlist.isPrivate = isPrivate === true || isPrivate === "true";
    }

    await playlist.save({ validateBeforeSave: false });

    return res.status(200).json(
        new apiResponse(
            200,
            playlist,
            "Playlist updated successfully"
        )
    );
});

const editPlaylistItemOrder = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { itemsOrder } = req.body;

    // Added the requested Array validation here
    if (!Array.isArray(itemsOrder)) {
        throw new apiError(400, "itemsOrder must be an array");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        const isEditor = await isAuthorizedEditor(playlistId, req.user._id);
        if (!isEditor) {
            throw new apiError(403, "You are not authorized to edit this playlist");
        }
    }

    if (itemsOrder.length > 0) {
        const bulkOps = itemsOrder.map((item) => ({
            updateOne: {
                filter: { _id: item._id, playlist: playlistId },
                update: { $set: { order: item.order } }
            }
        }));

        await PlaylistItem.bulkWrite(bulkOps);
    }

    return res.status(200).json(
        new apiResponse(
            200,
            {},
            "Playlist order updated successfully"
        )
    );
});

//delete
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to delete this playlist");
    }

    await Promise.all([
        PlaylistItem.deleteMany({ playlist: playlistId }),
        PlaylistMember.deleteMany({ playlist: playlistId })
    ]);

    await playlist.deleteOne();

    return res.status(200).json(
        new apiResponse(
            200,
            { message: "Playlist deleted successfully" },
            "Playlist deleted successfully"
        )
    );
});

export {
    createPlaylist,
    addToPlatlistToggel,
    getPlaylist,
    getMyPlaylists,
    getUserPlaylists,
    getUserPlaylistsWithNoteStatus,
    getPlaylistItems,
    isNotePresentInPlaylist,
    editPlaylist,
    editPlaylistItemOrder,
    deletePlaylist
};