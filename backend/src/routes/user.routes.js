import { Router } from "express";
import {
    registerUser
    , loginUser
    , logoutUser
    , refreshAccessToken
    , changePassword
    , updateAccountDetails
    , getCurrentUser
    , updateProfilePic
    , deleteUser
    , getUserProfile
    , changeGmail
    , forgetPasswordGenerateOtp
    , verifyResetPasswordOtp
    , createAndSendEmailVerificationOtp
    , verifyEmailOtp
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/register").post(
    uploadImage.fields([
        {
            name: "profilePic",
            maxCount: 1,
        },
    ]),
    registerUser
);

router.route("/login").post(loginUser);
//secure  route
router.route("/logout").post(verifyJWT, logoutUser);//bug found;
router.route("/refresh-token").post(refreshAccessToken);
//patch
router.route("/change-password").patch(verifyJWT, changePassword);
router.route("/forgot-password-otp").post(forgetPasswordGenerateOtp);
router.route("/verify-reset-password-otp").post(verifyResetPasswordOtp);
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);
router.route("/change-gmail").patch(verifyJWT, changeGmail);
router.route("/update-profile-pic").patch(verifyJWT, uploadImage.single("profilePic"), updateProfilePic);
// to verify
router.route("/send-verification-otp").post(verifyJWT, createAndSendEmailVerificationOtp);
router.route("/verify-email-otp").post(verifyJWT, verifyEmailOtp);
//get
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/profile/:username").get(verifyJWT, getUserProfile);

//delete
router.route("/delete-account").delete(verifyJWT, deleteUser);//same bug

//all bugs debuged..
//working good;





export default router;