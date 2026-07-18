import { Router } from "express";
import {
    toggleLike,
    getUserLikes,
    isLiked,
    getNoteLikes,
} from "../controllers/like.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/toggle/:noteId").post(
    verifyJWT,
    toggleLike
);

router.route("/my-likes").get(
    verifyJWT,
    getUserLikes
);

router.route("/is-liked/:noteId").get(
    verifyJWT,
    isLiked
);

router.route("/note/:noteId").get(
    verifyJWT,
    getNoteLikes
);

export default router;