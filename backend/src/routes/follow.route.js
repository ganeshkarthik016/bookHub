import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { interactionLimiter } from "../middlewares/rateLimit.middleware.js";
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
    interactionLimiter,
    verifyJWT,
    toggleFollow
);//done testing

router.route("/is-following/:userId").get(
    verifyJWT,
    isFollowing
);//done testing

router.route("/followers/:userId").get(
    verifyJWT,
    getFollowers
);//done testing 

router.route("/following/:userId").get(
    verifyJWT,
    getFollowing
);//done testing

router.route("/my-friends").get(
    verifyJWT,
    getMyFriends
);//debuged

router.route("/suggestions").get(
    verifyJWT,
    suggestions
);//done testing


export default router;