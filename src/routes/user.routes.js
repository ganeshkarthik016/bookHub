import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    updateAccountDetails,
    getCurrentUser,
    updateProfilePic,
    deleteUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "profilePic",
            maxCount: 1,
        },
    ]),
    registerUser
);

router.route("/login").post(loginUser);
//secure  route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update-account-details").post(verifyJWT, updateAccountDetails);
router.route("/update-profile-pic").post(verifyJWT, upload.single("profilePic"), updateProfilePic);

//get
router.route("/get-current-user").get(verifyJWT, getCurrentUser);

//delete
router.route("/delete-account").delete(verifyJWT, deleteUser);






export default router;