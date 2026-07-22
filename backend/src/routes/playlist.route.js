import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
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
    verifyJWT,
    createPlaylist
);

router.route("/add-to-playlist/:playlistId").post(
    verifyJWT,
    addToPlatlistToggel
);
//patch
router.route("/edit-playlist/:playlistId").patch(
    verifyJWT,
    editPlaylist
);

router.route("/edit-playlist-item-order/:playlistId").patch(
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
    verifyJWT,
    deletePlaylist
);




export default router;


