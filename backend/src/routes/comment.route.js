import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    addComment,
    getNoteComments
} from "../controllers/comment.controller";

const router = Router();

router.route("/add-comment/:noteId").post(
    verifyJWT,
    addComment
);

router.route("/get-comments/:noteId").get(
    verifyJWT,
    getNoteComments
);





export default router;