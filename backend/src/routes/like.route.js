import { Router } from "express";
import {
    toggleLike,
    getUserLikes,
    isLiked,
    getNoteLikes,
} from "../controllers/like.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { interactionLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.route("/toggle/:noteId").post(
    interactionLimiter,
    verifyJWT,
    toggleLike
);//tested

router.route("/my-likes").get(
    verifyJWT,
    getUserLikes
);//tested

router.route("/is-liked/:noteId").get(
    verifyJWT,
    isLiked
);//tested

router.route("/note/:noteId").get(
    verifyJWT,
    getNoteLikes
);//tested

export default router;