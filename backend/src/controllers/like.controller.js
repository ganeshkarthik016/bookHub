import { Like } from "../models/like.model.js";
import { Note } from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";


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


const
export {
    getUserLikes
}