import { Like } from "../models/like.model.js";
import { Note } from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Follow } from "../models/follow.model.js";

//push
const toggleLike = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
        throw new apiError(404, "Note not found");
    }

    const existingLike = await Like.findOne({
        user: req.user._id,
        note: noteId,
    });

    if (existingLike) {
        await existingLike.deleteOne();

        note.likesCount = Math.max(0, note.likesCount - 1);
        await note.save({ validateBeforeSave: false });

        return res.status(200).json(
            new apiResponse(
                200,
                {
                    liked: false,
                    likesCount: note.likesCount,
                },
                "Note unliked successfully"
            )
        );
    }

    await Like.create({
        user: req.user._id,
        note: noteId,
    });

    note.likesCount += 1;

    await note.save({ validateBeforeSave: false });

    return res.status(200).json(
        new apiResponse(
            200,
            {
                liked: true,
                likesCount: note.likesCount,
            },
            "Note liked successfully"
        )
    );
});

//get 
const getUserLikes = asyncHandler(async (req, res) => {
    const {
        search,
        tag,
        sort,
        page = 1,
        limit = 10,
    } = req.query;

    const pageNo = Math.max(Number(page), 1);
    const pageLimit = Math.min(Math.max(Number(limit), 1), 50);

    // Get all liked note ids
    const likes = await Like.find({
        user: req.user._id,
    });

    const noteIds = likes.map(like => like.note);

    let filter = {
        _id: { $in: noteIds },
        isPrivate: false,
    };

    if (search?.trim()) {
        filter.$or = [
            {
                title: {
                    $regex: search.trim(),
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: search.trim(),
                    $options: "i",
                },
            },
            {
                tags: {
                    $regex: search.trim(),
                    $options: "i",
                },
            },
        ];
    }

    if (tag?.trim()) {
        filter.tags = tag.trim().toLowerCase();
    }

    let sortOption = { createdAt: -1 };

    switch (sort) {
        case "oldest":
            sortOption = { createdAt: 1 };
            break;

        case "popular":
            sortOption = { likesCount: -1 };
            break;

        case "views":
            sortOption = { views: -1 };
            break;

        case "downloads":
            sortOption = { downloads: -1 };
            break;
    }

    const notes = await Note.find(filter)
        .sort(sortOption)
        .skip((pageNo - 1) * pageLimit)
        .limit(pageLimit);

    return res.status(200).json(
        new apiResponse(
            200,
            {
                notes,
                page: pageNo,
                limit: pageLimit,
                hasMore: notes.length === pageLimit,
            },
            "Liked notes fetched successfully"
        )
    );
});

const isLiked = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const like = await Like.findOne({
        user: req.user._id,
        note: noteId,
    });

    return res.status(200).json(
        new apiResponse(
            200,
            {
                liked: !!like,
            },
            "Status fetched successfully"
        )
    );
});

const getNoteLikes = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
        throw new apiError(404, "Note not found");
    }

    // All likes for this note
    const likes = await Like.find({
        note: noteId,
    })
        .populate(
            "user",
            "userName userFullName profilePic"
        )
        .sort({ createdAt: -1 });

    // Users followed by current user
    const following = await Follow.find({
        follower: req.user._id,
    }).select("following");

    const followingSet = new Set(
        following.map(f => f.following.toString())
    );

    const followingLikes = [];
    const otherLikes = [];

    for (const like of likes) {
        if (followingSet.has(like.user._id.toString())) {
            followingLikes.push(like);
        } else {
            otherLikes.push(like);
        }
    }

    return res.status(200).json(
        new apiResponse(
            200,
            {
                likesCount: note.likesCount,
                following: followingLikes,
                others: otherLikes,
            },
            "Likes fetched successfully"
        )
    );
});

export {
    getUserLikes
    , toggleLike
    , isLiked
    , getNoteLikes

}