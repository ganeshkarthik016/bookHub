import { Blog } from "../models/blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { queueBlogPdf } from "../queues/blogPdf.queue.js";

const ownerOnlyBlog = async (blogId, userId) => {
    const blog = await Blog.findById(blogId);
    if (!blog) throw new apiError(404, "Written note not found");
    if (blog.owner.toString() !== userId.toString()) throw new apiError(403, "You are not authorized to edit this written note");
    return blog;
};

const createBlog = asyncHandler(async (req, res) => {
    const { title, description = "", content } = req.body;
    if (!title?.trim() || !content?.trim()) throw new apiError(400, "Title and content are required");
    const blog = await Blog.create({ owner: req.user._id, title: title.trim(), description: description.trim(), content });
    await queueBlogPdf(blog._id, blog.contentVersion);
    return res.status(201).json(new apiResponse(201, blog, "Written note saved and queued for PDF generation"));
});

const updateBlog = asyncHandler(async (req, res) => {
    const blog = await ownerOnlyBlog(req.params.blogId, req.user._id);
    const { title, description, content } = req.body;
    if (title !== undefined) blog.title = title.trim();
    if (description !== undefined) blog.description = description.trim();
    if (content !== undefined) {
        if (!content.trim()) throw new apiError(400, "Content is required");
        blog.content = content;
        blog.contentVersion += 1;
        blog.pdfStatus = "PENDING";
    }
    await blog.save();
    if (content !== undefined) await queueBlogPdf(blog._id, blog.contentVersion);
    return res.status(200).json(new apiResponse(200, blog, "Written note updated"));
});

const getMyBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ owner: req.user._id }).sort({ updatedAt: -1 });
    return res.status(200).json(new apiResponse(200, blogs, "Written notes fetched"));
});

const getBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.blogId).populate("owner", "userName userFullName profilePic");
    if (!blog) throw new apiError(404, "Written note not found");
    const response = blog.toObject();
    if (blog.owner._id.toString() !== req.user._id.toString()) delete response.content;
    return res.status(200).json(new apiResponse(200, response, "Written note fetched"));
});

const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await ownerOnlyBlog(req.params.blogId, req.user._id);
    await blog.deleteOne();
    return res.status(200).json(new apiResponse(200, {}, "Written note deleted"));
});

export { createBlog, updateBlog, getMyBlogs, getBlog, deleteBlog };
