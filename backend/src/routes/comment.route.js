import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
    addComment,
    getNoteComments,
    editMyComment,
    deleteMyComment,
    getMyComments
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

router.route("/edit-comment/:commentId").patch(
    verifyJWT,
    editMyComment
);

router.route("/delete-comment/:commentId").delete(
    verifyJWT,
    deleteMyComment
);

router.route("/get-my-comments").get(
    verifyJWT,
    getMyComments
);






export default router;