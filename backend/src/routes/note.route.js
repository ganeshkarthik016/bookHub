import { Router } from "express";
import {
    uploadNotes,
    updateNoteDetails,
    getCurrentNote,
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
);

router.route("/update-note-details/:noteId").post(
    verifyJWT,
    updateNoteDetails
);


//get 
router.route("/get-current-note/:noteId").get(
    verifyJWT,
    getCurrentNote
);



export default router;