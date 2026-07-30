import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { interactionLimiter } from "../middlewares/rateLimit.middleware.js";
import {
    shareToUser,
    getMembers,
    getMyEditorPlaylists,
    getMyViewerPlaylists,
    updateMemberRole,
    removeMember,
    leavePlaylist
} from "../controllers/playlistShare.controller.js";

const router = Router();

// Apply auth middleware to all routes in this file
router.use(verifyJWT);

// Routes for fetching a user's shared playlists
router.route("/editor").get(getMyEditorPlaylists);
router.route("/viewer").get(getMyViewerPlaylists);

// Routes for managing a specific playlist's members
router.route("/:playlistId/members")
    .get(getMembers);

router.route("/:playlistId/members/:userId")
    .patch(interactionLimiter, updateMemberRole)
    .delete(interactionLimiter, removeMember);


// Route to leave a playlist
router.route("/:playlistId/leave").delete(interactionLimiter, leavePlaylist);

export default router;