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
    return !!(await PlaylistMember.exists({
        playlist: playlistId,
        user: userId,
        role: "EDITOR"
    }));
};

const isAuthorizedViewer = async (playlistId, userId) => {
    return !!(await PlaylistMember.exists({
        playlist: playlistId,
        user: userId
    }));
};

//post
const shareToUser = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { userName, role } = req.body;

    if (!userName || userName.trim() === "") {
        throw new apiError(400, "userName is required")
    }
    if (!role) {
        throw new apiError(400, "role is required")
    }
    const finalRole = role ? role.toUpperCase() : "VIEWER";
    if (!["EDITOR", "VIEWER"].includes(finalRole)) {
        throw new apiError(400, "Invalid role. Must be EDITOR or VIEWER");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Only the playlist owner can invite collaborators");
    }
    const targetUser = await User.findOne({
        userName: userName
            .trim()
            .toLowerCase()
    });
    if (!targetUser) {
        throw new apiError(404, "User not found");
    }
    if (targetUser._id.toString() === req.user._id.toString()) {
        throw new apiError(400, "You already own this playlist");
    }

    const existingMember = await PlaylistMember.findOne({
        playlist: playlistId,
        user: targetUser._id
    });

    if (existingMember) {
        throw new apiError(409, "User is already a member of this playlist");
    }
    const member = await PlaylistMember.create({
        user: targetUser._id,
        playlist: playlistId,
        role: finalRole
    })
        .populate(
            "user",
            "userName userFullName profilePic"
        )
    return res.status(200).json(
        new apiResponse(
            201,
            member,
            "Member added successfully"
        )

    )

});

const getMembers = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (
        playlist.isPrivate &&
        playlist.owner.toString() !== req.user._id.toString() &&
        !(await isAuthorizedViewer(playlistId, req.user._id))
    ) {
        throw new apiError(403, "You do not have permission to view this playlist's members");
    }
    const members = await PlaylistMember.find({ playlist: playlistId })
        .populate("user", "userName userFullName profilePic")
        .sort({ createdAt: -1 });
    const ownerObject = {
        _id: playlist.owner._id,
        user: playlist.owner,
        role: "OWNER"
    };
    const fullMemberList = [ownerObject, ...members];

    return res.status(200).json(
        new apiResponse(
            200,
            fullMemberList,
            "Playlist members fetched successfully"
        )
    );
});

const getMyEditorPlaylists = asyncHandler(async (req, res) => {
    // Fetch all membership records for this user where they are an EDITOR
    const memberships = await PlaylistMember.find({
        user: req.user._id,
        role: "EDITOR"
    }).populate("playlist");

    const playlists = memberships
        .map(member => member.playlist)
        .filter(playlist => playlist !== null);

    return res.status(200).json(
        new apiResponse(
            200,
            playlists,
            "Editor playlists fetched successfully"
        )
    );
});

const getMyViewerPlaylists = asyncHandler(async (req, res) => {
    const memberships = await PlaylistMember.find({
        user: req.user._id,
        role: "VIEWER"
    }).populate("playlist");

    const playlists = memberships
        .map(member => member.playlist)
        .filter(playlist => playlist !== null);

    return res.status(200).json(
        new apiResponse(
            200,
            playlists,
            "Viewer playlists fetched successfully"
        )
    );
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const { playlistId, userId } = req.params;
    const { role } = req.body;

    const finalRole = role ? role.toUpperCase() : "VIEWER";

    if (!["EDITOR", "VIEWER"].includes(finalRole)) {
        throw new apiError(400, "Invalid role. Must be EDITOR or VIEWER");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Only the playlist owner can update member roles");
    }

    if (userId === req.user._id.toString()) {
        throw new apiError(400, "You already own this playlist");
    }

    const member = await PlaylistMember.findOne({
        playlist: playlistId,
        user: userId
    });

    if (!member) {
        throw new apiError(404, "Member not found");
    }

    member.role = finalRole;
    await member.save();

    await member.populate(
        "user",
        "userName userFullName profilePic"
    );

    return res.status(200).json(
        new apiResponse(
            200,
            member,
            "Member role updated successfully"
        )
    );
});

const removeMember = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { userId } = req.body;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Only the playlist owner can remove collaborators");
    }
    if (!userId) {
        throw new apiError(400, "userId is required");
    }
    if (userId === req.user._id.toString()) {
        throw new apiError(400, "You cannot remove yourself from the playlist");
    }
    const targetUser = await User.findById(userId);
    if (!targetUser) {
        throw new apiError(404, "User not found");
    }
    const member = await PlaylistMember.findOneAndDelete({
        playlist: playlistId,
        user: targetUser._id
    });
    if (!member) {
        throw new apiError(404, "Member not found");
    }
    return res.status(200).json(
        new apiResponse(
            200,
            { message: "Member removed successfully" },
            "Member removed successfully"
        )
    )
});

const leavePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const userId = req.user._id;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new apiError(404, "Playlist not found");
    }
    if (userId === playlist.owner.toString()) {
        throw new apiError(403, "You can't leave the playlist you created")
    }
    const member = await PlaylistMember.findOneAndDelete({
        playlist: playlistId,
        user: userId
    });
    if (!member) {
        throw new apiError(404, "Member not found");
    }
    return res.status(200).json(
        new apiResponse(
            200,
            { message: "You have left the playlist successfully" },
            "You have left the playlist successfully"
        )
    )
});