import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    toggleFollow,
    isFollowing,
    getFollowers,
    getFollowing,
    getMyFriends,
    suggestions
} from "../controllers/follow.controller.js";


const router = Router();

router.route("/toggle/:userId").post(
    verifyJWT,
    toggleFollow
);

router.route("/is-following/:userId").get(
    verifyJWT,
    isFollowing
);

router.route("/followers/:userId").get(
    verifyJWT,
    getFollowers
);

router.route("/following/:userId").get(
    verifyJWT,
    getFollowing
);

router.route("/my-friends").get(
    verifyJWT,
    getMyFriends
);

router.route("/suggestions").get(
    verifyJWT,
    suggestions
);


export default router;