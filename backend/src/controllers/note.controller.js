import { Note } from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadNotes = asyncHandler(async (req, res) => {

    const { title, description, tags, isPrivate } = req.body;

    if (!title?.trim()) {
        throw new apiError(400, "Title is required");
    }

    const pdfPath = req.files?.pdf?.[0]?.path;
    const coverImagePath = req.files?.coverImage?.[0]?.path;

    if (!pdfPath) {
        throw new apiError(400, "PDF is required");
    }

    // Upload PDF
    const uploadedPDF = await uploadOnCloudinary(
        pdfPath,
        "bookhub/pdfs"
    );

    if (!uploadedPDF) {
        throw new apiError(500, "Failed to upload PDF");
    }

    // Upload Cover Image (Optional)
    let uploadedCover = null;

    if (coverImagePath) {

        uploadedCover = await uploadOnCloudinary(
            coverImagePath,
            "bookhub/covers"
        );

        if (!uploadedCover) {
            throw new apiError(500, "Failed to upload cover image");
        }
    }

    const note = await Note.create({

        title: title.trim(),

        description: description?.trim() || "",

        pdf: {
            url: uploadedPDF.secure_url,
            publicId: uploadedPDF.public_id,
        },

        coverImage: uploadedCover
            ? {
                url: uploadedCover.secure_url,
                publicId: uploadedCover.public_id,
            }
            : {
                url: "",
                publicId: "",
            },

        owner: req.user._id,

        tags: tags
            ? tags
                .split(",")
                .map(tag => tag.trim().toLowerCase())
                .filter(Boolean)
            : [],

        isPrivate: isPrivate === "true",
    });

    return res.status(201).json(
        new apiResponse(
            201,
            note,
            "Note uploaded successfully"
        )
    );
});

//petch
const updateNoteDetails = asyncHandler(async (req, res) => {
    const { title, description, tags, isPrivate } = req.body;
    const { noteId } = req.params;
    if (!noteId) {
        throw new apiError(400, "Note id is required")

    }
    const note = await Note.findById(noteId);
    if (!note) {
        throw new apiError(404, "Note not found")
    }
    if (note.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized to update this note")
    }
    note.title = title?.trim();
    note.description = description?.trim();

    if (tags) {
        note.tags = [...new Set(
            tags.map(tag => tag.trim().toLowerCase())
        )];
    }

    if (isPrivate !== undefined) {
        note.isPrivate = isPrivate === "true" || isPrivate === true;
    }
    await note.save({ validateBeforeSave: false });
    const newNote = await Note.findById(noteId);
    if (!newNote) {
        throw new apiError(404, "Note not found")
    }

    return res.status(200).json(
        new apiResponse(
            200,
            newNote,
            "Note updated successfully"
        )
    )
})

const updateNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const pdfPath = req.files?.pdf?.[0]?.path;
    const coverImagePath = req.files?.coverImage?.[0]?.path;
    if (!pdfPath && !coverImagePath) {
        throw new apiError(
            400,
            "Please upload a PDF or cover image"
        );
    }
    const note = await Note.findById(noteId);

    if (!note) {
        throw new apiError(404, "Note not found");
    }
    if (note.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized");
    }
    let uploadedPdf = null;
    let uploadedCover = null;
    if (coverImagePath) {

        uploadedCover = await uploadOnCloudinary(
            coverImagePath,
            "bookhub/covers"
        );

        if (!uploadedCover) {
            throw new apiError(500, "Failed to upload cover image");
        }
    }
    if (pdfPath) {

        uploadedPdf = await uploadOnCloudinary(
            pdfPath,
            "bookhub/pdfs"
        );

        if (!uploadedPdf) {
            throw new apiError(500, "Failed to upload pdf");
        }
    }

    if (uploadedCover) {
        if (uploadedCover && note.coverImage.publicId) {
            await cloudinary.uploader.destroy(
                note.coverImage.publicId
            );
        }

        note.coverImage.url = uploadedCover.secure_url;
        note.coverImage.publicId = uploadedCover.public_id;

    }
    if (uploadedPdf) {
        if (uploadedPdf && note.pdf.publicId) {
            await cloudinary.uploader.destroy(
                note.pdf.publicId,
                {
                    resource_type: "raw"
                }
            );
        }
        note.pdf.url = uploadedPdf.secure_url;
        note.pdf.publicId = uploadedPdf.public_id;
    }
    await note.save({ validateBeforeSave: false });
    const newNote = await Note.findById(noteId);
    if (!newNote) {
        throw new apiError(404, "Note not found")
    }
    return res.status(200).json(
        new apiResponse(
            200,
            newNote,
            "Note updated successfully"
        )
    )
})


// get 
const getCurrentNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
        throw new apiError(404, "Note not found");
    }

    if (note.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "You are not authorized");
    }

    return res.status(200).json(
        new apiResponse(
            200,
            note,
            "Note fetched successfully"
        )
    );
});

const getMyNotes = asyncHandler(async (req, res) => {
    const { sort } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    let sortOption = { createdAt: -1 }; // default: newest

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

    const notes = await Note.find({
        owner: req.user._id
    }).sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

    return res.status(200).json(
        new apiResponse(
            200,
            {
                notes,
                page,
                limit
            },
            "Notes fetched successfully"
        )
    );
});

const getUserNotes = asyncHandler(async (req, res) => {
    const { userName } = req.params;
    const { sort } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

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
    const user = await User.findOne({
        userName: userName.trim().toLowerCase()
    });

    if (!user) {
        throw new apiError(404, "User not found");
    }

    const userId = user._id;

    const notes = await Note.find({
        owner: userId,
        isPrivate: false
    }).sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

    return res.status(200).json(
        new apiResponse(
            200,
            {
                notes,
                page,
                limit,
            },
            "Notes fetched successfully"
        )
    )

})

const searchNotes = asyncHandler(async (req, res) => {
    const {
        search,
        tag,
        sort,
        page = 1,
        limit = 10,
    } = req.query;

    const pageNo = Math.max(Number(page), 1);
    const pageLimit = Math.min(Math.max(Number(limit), 1), 50);

    let filter = {
        isPrivate: false,
    };

    // Search title or description
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

    // Search by tag
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
            "Notes fetched successfully"
        )
    );
})

const downloadNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
        throw new apiError(404, "Note not found");
    }

    if (note.isPrivate && note.owner.toString() !== req.user._id.toString()) {
        throw new apiError(403, "Unauthorized");
    }

    note.downloads += 1;
    await note.save({ validateBeforeSave: false });

    return res.status(200).json(
        new apiResponse(
            200,
            {
                downloadUrl: note.pdf.url
            },
            "Download started"
        )
    );
});
//delete
const deleteNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) {
        throw new apiError(404, "Note not found");
    }
    if (req.user._id.toString() !== note.owner.toString()) {
        throw new apiError(403, "You are not authorized to delete this note")
    }
    if (note.pdf.publicId) {
        await cloudinary.uploader.destroy(
            note.pdf.publicId,
            { resource_type: "raw" }
        );
    }

    if (note.coverImage.publicId) {
        await cloudinary.uploader.destroy(
            note.coverImage.publicId
        );
    }
    await note.deleteOne();
    return res.status(200).json(
        new apiResponse(
            200,
            { message: "Note deleted successfully" },
            "Note deleted successfully"
        )
    )

});



export {
    uploadNotes
    , updateNoteDetails
    , getCurrentNote
    , getMyNotes
    , updateNote
    , deleteNote
    , getUserNotes
    , searchNotes
    , downloadNote

};