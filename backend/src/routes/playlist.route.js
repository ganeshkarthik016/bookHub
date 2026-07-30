import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { interactionLimiter } from "../middlewares/rateLimit.middleware.js";
import {
    createPlaylist,
    addToPlatlistToggel,
    getPlaylist,
    getMyPlaylists,
    getUserPlaylists,
    getUserPlaylistsWithNoteStatus,
    getPlaylistItems,
    isNotePresentInPlaylist,
    editPlaylist,
    editPlaylistItemOrder,
    deletePlaylist,
} from "../controllers/playlist.controller.js";


const router = Router();
//post
router.route("/create").post(
    interactionLimiter,
    verifyJWT,
    createPlaylist
);

router.route("/add-to-playlist/:playlistId").post(
    interactionLimiter,
    verifyJWT,
    addToPlatlistToggel
);
//patch
router.route("/edit-playlist/:playlistId").patch(
    interactionLimiter,
    verifyJWT,
    editPlaylist
);

router.route("/edit-playlist-item-order/:playlistId").patch(
    interactionLimiter,
    verifyJWT,
    editPlaylistItemOrder
);
//get
router.route("/get-playlist/:playlistId").get(
    verifyJWT,
    getPlaylist
);

router.route("/get-my-playlists").get(
    verifyJWT,
    getMyPlaylists
);

router.route("/get-user-playlists/:userName").get(
    verifyJWT,
    getUserPlaylists
);

router.route("/get-playlist-items/:playlistId").get(
    verifyJWT,
    getPlaylistItems
);

router.route("/get-user-playlists-with-note-status/:noteId").get(
    verifyJWT,
    getUserPlaylistsWithNoteStatus
);

router.route("/is-note-present-in-playlist/:playlistId").get(
    verifyJWT,
    isNotePresentInPlaylist
);

//delete
router.route("/delete-playlist/:playlistId").delete(
    interactionLimiter,
    verifyJWT,
    deletePlaylist
);




export default router;


