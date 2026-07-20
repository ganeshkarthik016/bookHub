import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Follow } from "../models/follow.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { Mongoose } from "mongoose";


const addComment = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
        throw new apiError(400, "Comment cannot be empty");
    }

    const note = await Note.findById(noteId);

    if (!note) {
        throw new apiError(404, "Note not found");
    }

    const comment = await Comment.create({
        text: text.trim(),
        user: req.user._id,
        note: noteId,
    });

    return res.status(201).json(
        new apiResponse(
            201,
            comment,
            "Comment added successfully"
        )
    );
});

const getNoteComments = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 10;

    const note = await Note.findById(noteId);

    if (!note) {
        throw new apiError(404, "Note not found");
    }

    if (
        note.isPrivate &&
        note.owner.toString() !== req.user._id.toString()
    ) {
        throw new apiError(403, "You are not authorized");
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                note: new mongoose.Types.ObjectId(noteId),
            },
        },

        // Check whether comment author is followed
        {
            $lookup: {
                from: "follows",
                let: {
                    commentUser: "$user",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            "$follower",
                                            new mongoose.Types.ObjectId(req.user._id),
                                        ],
                                    },
                                    {
                                        $eq: [
                                            "$following",
                                            "$$commentUser",
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: "followInfo",
            },
        },

        {
            $addFields: {
                isFollowing: {
                    $gt: [
                        {
                            $size: "$followInfo",
                        },
                        0,
                    ],
                },

                isOwner: {
                    $eq: [
                        "$user",
                        new mongoose.Types.ObjectId(req.user._id),
                    ],
                },

                isAuthor: {
                    $eq: [
                        "$user",
                        note.owner,
                    ],
                },

                priority: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $eq: [
                                        "$user",
                                        note.owner,
                                    ],
                                },
                                then: 4,
                            },
                            {
                                case: {
                                    $eq: [
                                        "$user",
                                        new mongoose.Types.ObjectId(req.user._id),
                                    ],
                                },
                                then: 3,
                            },
                            {
                                case: {
                                    $gt: [
                                        {
                                            $size: "$followInfo",
                                        },
                                        0,
                                    ],
                                },
                                then: 2,
                            },
                        ],
                        default: 1,
                    },
                },
            },
        },

        {
            $sort: {
                priority: -1,
                createdAt: -1,
            },
        },

        {
            $skip: (page - 1) * limit,
        },

        {
            $limit: limit,
        },

        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            userName: 1,
                            userFullName: 1,
                            profilePic: 1,
                        },
                    },
                ],
                as: "user",
            },
        },

        {
            $unwind: "$user",
        },

        {
            $project: {
                followInfo: 0,
                priority: 0,
            },
        },
    ]);

    const totalComments = await Comment.countDocuments({
        note: noteId,
    });

    return res.status(200).json(
        new apiResponse(
            200,
            {
                comments,
                page,
                totalPages: Math.ceil(totalComments / limit),
                totalComments,
                hasMore: page * limit < totalComments,
            },
            "Comments fetched successfully"
        )
    );
});

const editMyComment = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { commentId } = req.params;
    const { text } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apiError(404, "Comment not found");
    }
    if (!text || text.trim() === "") {
        throw new apiError(400, "Comment cannot be empty");
    }
    if (comment.user.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to edit this comment")
    }
    if (comment.text === text.trim()) {
        throw new apiError(400, "Comment cannot be same");
    }
    comment.text = text.trim();
    comment.is_edited = true;
    await comment.save({ validateBeforeSave: false });
    const updatedComment = await Comment.findById(comment._id)
        .populate("user", "userName userFullName profilePic");
    return res.status(200).json(
        new apiResponse(
            200,
            updatedComment,
            "Comment updated successfully"
        ))
});

const deleteMyComment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apiError(404, "Comment not found");
    }
    if (comment.user.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to delete this comment");
    }
    await comment.deleteOne();
    return res.status(200).json(
        new apiResponse(
            200,
            { message: "Comment deleted successfully" },
            "Comment deleted successfully"
        )
    )
})

const getMyComments = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const comments = await Comment.find({ user: userId })
        .populate("note", "title")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    const totalComments = await Comment.countDocuments({
        user: userId,
    });
    return res.status(200).json(
        new apiResponse(
            200,
            {
                comments,
                page,
                totalPages: Math.ceil(totalComments / limit),
                totalComments,
                hasMore: page * limit < totalComments,
            },
            "Comments fetched successfully"
        )
    )
})




export {
    addComment
    , getNoteComments
    , editMyComment
    , deleteMyComment
    , getMyComments

}