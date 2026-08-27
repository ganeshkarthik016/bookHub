import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { interactionLimiter } from "../middlewares/rateLimit.middleware.js";
import { createBlog, updateBlog, getMyBlogs, getBlog, deleteBlog } from "../controllers/blog.controller.js";

const router = Router();
router.use(verifyJWT);
router.route("/").post(interactionLimiter, createBlog).get(getMyBlogs);
router.route("/:blogId").get(getBlog).patch(interactionLimiter, updateBlog).delete(interactionLimiter, deleteBlog);
export default router;
