import { Router } from "express";
import {
    uploadNotes,
    updateNoteDetails,
    getCurrentNote,
    getMyNotes,
    updateNote,
    deleteNote,
    getUserNotes,
    searchNotes,
    downloadNote,
} from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadNoteFiles } from "../middlewares/multer.middleware.js";

const router = Router();
//post
router.route("/upload-notes").post(
    verifyJWT,
    uploadNoteFiles.fields([
        {
            name: "pdf",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    uploadNotes
);//bug found
//debuuged
//patch
router.route("/update-note-details/:noteId").patch(
    verifyJWT,
    updateNoteDetails
);

router.route("/update-note/:noteId").patch(verifyJWT,
    uploadNoteFiles.fields([
        {
            name: "pdf",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    updateNote
);//bug found 
//debuged

//get 
router.route("/get-current-note/:noteId").get(
    verifyJWT,
    getCurrentNote
);//done testing
router.route("/get-my-notes").get(
    verifyJWT,
    getMyNotes
);//done testing
router.route("/get-user-notes/:userName").get(
    getUserNotes
);//working
router.route("/search-notes").get(
    searchNotes
);// working
router.route("/download-note/:noteId").get(
    verifyJWT,
    downloadNote
);// ya it does generate a download link

//delete
router.route("/delete-note/:noteId").delete(
    verifyJWT,
    deleteNote
);//test done

//all testes r done




export default router;