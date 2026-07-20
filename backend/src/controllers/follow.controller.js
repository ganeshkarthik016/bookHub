import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Follow } from "../models/follow.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";


const toggleFollow = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        throw new apiError(404, "User not found");
    }
    if (userId.toString() === req.user._id.toString()) {
        throw new apiError(400, "You cannot follow yourself");
    }
    const existingFollow = await Follow.findOne({
        follower: req.user._id,
        following: userId,
    });
    if (req.user._id.toString() !== userId.toString()) {
        if (existingFollow) {
            await existingFollow.deleteOne();
            return res.status(200).json(
                new apiResponse(
                    200,
                    {
                        isFollowing: false,
                    },
                    "Unfollowed successfully"
                )
            );
        }
        else {
            await Follow.create({
                follower: req.user._id,
                following: userId,
            });
            return res.status(200).json(
                new apiResponse(
                    200,
                    {
                        isFollowing: true,
                    },
                    "Followed successfully"
                )
            );
        }
    }

});


const isFollowing = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
        throw new apiError(404, "User not found");
    }
    if (userId.toString() === req.user._id.toString()) {
        throw new apiError(400, "You cannot follow yourself");
    }
    const isFollowing = await Follow.exists({
        follower: req.user._id,
        following: userId,
    });
    return res.status(200).json(
        new apiResponse(
            200,
            {
                isFollowing: !!isFollowing,
            },
            "Status fetched successfully"
        )
    )

});

const getFollowers = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        throw new apiError(404, "User not found");
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const followers = await Follow.find({
        following: userId,
    })
        .populate(
            "follower",
            "userName userFullName profilePic"
        )
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const totalFollowers = await Follow.countDocuments({
        following: userId,
    });

    return res.status(200).json(
        new apiResponse(
            200,
            {
                followers,
                page,
                totalFollowers,
                totalPages: Math.ceil(totalFollowers / limit),
                hasMore: page * limit < totalFollowers,
            },
            "Followers fetched successfully"
        )
    );
});

const getFollowing = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        throw new apiError(404, "User not found");
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const following = await Follow.find({
        follower: userId,
    })
        .populate(
            "following",
            "userName userFullName profilePic"
        )
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    const totalFollowing = await Follow.countDocuments({
        follower: userId,
    });

    return res.status(200).json(
        new apiResponse(
            200,
            {
                following,
                page,
                totalFollowing,
                totalPages: Math.ceil(totalFollowing / limit),
                hasMore: page * limit < totalFollowing,
            },
            "Following fetched successfully"
        )
    );
});

const getMyFriends = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const following = await Follow.find({
        follower: userId
    }).select("following");

    const friends = await Follow.find({
        follower: {
            $in: following.map(f => f.following)
        },
        following: userId
    })
        .populate("following", "userName userFullName profilePic")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    return res.status(200).json(
        new apiResponse(
            200,
            {
                friends
            },
            "data fetched successfully"
        )
    )

});

const suggestions = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const suggestions = await Follow.aggregate([
        // Step 1: Get everyone I follow
        {
            $match: {
                follower: userId,
            },
        },

        // Step 2: Find who THEY follow
        {
            $lookup: {
                from: "follows",
                localField: "following",
                foreignField: "follower",
                as: "friendsFollowing",
            },
        },

        {
            $unwind: "$friendsFollowing",
        },

        // Step 3: Candidate user
        {
            $replaceRoot: {
                newRoot: "$friendsFollowing",
            },
        },

        // Step 4: Remove myself
        {
            $match: {
                following: {
                    $ne: userId,
                },
            },
        },

        // Step 5: Count mutual friends
        {
            $group: {
                _id: "$following",
                mutualFriends: {
                    $sum: 1,
                },
            },
        },

        // Step 6: Remove people I already follow
        {
            $lookup: {
                from: "follows",
                let: {
                    suggestedUser: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$follower", userId],
                                    },
                                    {
                                        $eq: ["$following", "$$suggestedUser"],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: "alreadyFollowing",
            },
        },

        {
            $match: {
                alreadyFollowing: {
                    $size: 0,
                },
            },
        },

        // Step 7: Get user details
        {
            $lookup: {
                from: "users",
                localField: "_id",
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

        // Step 8: Sort by most mutual friends
        {
            $sort: {
                mutualFriends: -1,
            },
        },

        {
            $skip: (page - 1) * limit,
        },

        {
            $limit: limit,
        },
    ]);

    return res.status(200).json(
        new apiResponse(
            200,
            suggestions,
            "Suggestions fetched successfully"
        )
    );
});

export {
    toggleFollow
    , isFollowing
    , getFollowers
    , getFollowing
    , getMyFriends
    , suggestions

}