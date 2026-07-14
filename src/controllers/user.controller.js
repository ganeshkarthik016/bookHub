import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../constants.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    const { userFullName, email, userName, password, bio } = req.body;
    if (
        [userFullName, email, userName, password].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new apiError(400, "All required fields are required");
    }
    // Check if email already exists
    let existedUser = await User.findOne({
        email: email.trim().toLowerCase(),
    });

    if (existedUser) {
        throw new apiError(409, "Email already exists");
    }
    // Check if username already exists
    existedUser = await User.findOne({
        userName: userName.trim().toLowerCase(),
    });

    if (existedUser) {
        throw new apiError(409, "Username already exists");
    }
    const len = password.length;
    if (len < 8 || len > 64) {
        throw new apiError(400, "Password must be between 8 and 64 characters");
    }

    let profilePic;

    const profilePicPath = req.files?.profilePic?.[0]?.path;

    if (profilePicPath) {
        const uploaded = await uploadOnCloudinary(profilePicPath);

        if (!uploaded) {
            throw new apiError(500, "Failed to upload profile picture");
        }

        profilePic = uploaded.secure_url;
    }

    const user = await User.create({
        userFullName: userFullName.trim().toUpperCase(),
        userName: userName.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        bio: bio?.trim(),
        profilePic,
    });

    // Check whether user was created successfully
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new apiError(
            500,
            "Something went wrong while registering the user"
        );
    }
    // Return success response
    return res.status(201).json(
        new apiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName && !email) {
        throw new apiError(400, "Username or email is required")
    }
    if (!password) {
        throw new apiError(400, "Password is required")
    }
    const user = await User.findOne({
        $or: [
            { userName: userName?.trim().toLowerCase() },
            { email: email?.trim().toLowerCase() },
        ],
    })
    if (!user) {
        throw new apiError(404, "User not found")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new apiError(401, "Invalid credentials")
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new apiResponse(
                200, {
                user:
                    loggedUser, accessToken: accessToken, refreshToken: refreshToken
            },
                "User logged in successfully"
            )
        )


})
// secure controlers
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });
    const options = {
        httpOnly: true,
        secure: true
    }
    console.log(req.user.userName);
    return res.status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new apiResponse(
                200,
                { message: "User logged out successfully" },
                "User logged out successfully"
            )
        );
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken
        if (!incomingrefreshToken) {
            throw new apiError(401, "Unauthorized access")
        }
        const decodedToken = jwt.verify(incomingrefreshToken, REFRESH_TOKEN_SECRET);
        if (!decodedToken) {
            throw new apiError(401, "Unauthorized access")
        }
        const user = await User.findById(decodedToken._id);
        if (!user) {
            throw new apiError(404, "User not found, unauthorized access. Invalid refresh token")
        }
        if (incomingrefreshToken !== user.refreshToken) {
            throw new apiError(401, "Unauthorized access , invalid refresh token")

        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const new_accessToken = await user.generateAccessToken();
        const new_refreshToken = await user.generateRefreshToken();
        return res.status(200)
            .cookie("refreshToken", new_refreshToken, options)
            .cookie("accessToken", new_accessToken, options)
            .json(
                new apiResponse(
                    200, {
                    accessToken: new_accessToken, refreshToken: new_refreshToken
                },
                    "Access token refreshed successfully"
                )
            )
    } catch (Error) {
        throw new apiError(401, Error?.message || "Somthing went wrong while refreshing the access token")
    }


})

//update controllers

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new apiError(400, "All fields are required")
    }
    if (newPassword !== confirmPassword) {
        throw new apiError(400, "Passwords do not match")
    }
    if (newPassword.length < 8 || newPassword.length > 64) {
        throw new apiError(400, "Password must be between 8 and 64 characters");
    }
    if (oldPassword === newPassword) {
        throw new apiError(
            400,
            "New password must be different"
        );
    }
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new apiError(404, "User not found")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new apiError(401, "Invalid credentials")
    }
    user.password = newPassword;
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
    const options = {
        httpOnly: true,
        secure: true
    }


    return res.status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new apiResponse(
                200,
                { message: "Password changed successfully" },
                "Password changed successfully"
            )
        )



})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { userFullName, bio } = req.body;
    if (!userFullName && !bio) {
        throw new apiError(400, "Atleast one fields is required")
    }
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new apiError(404, "User not found")
    }
    if (userFullName) {
        user.userFullName = userFullName.trim().toUpperCase();
    }
    if (bio) {
        user.bio = bio.trim();
    }
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                { message: "Account details updated successfully" },
                "Account details updated successfully"
            )
        )

})

const updateProfilePic = asyncHandler(async (req, res) => {
    const profilePicPath = req.files.path;
    if (!profilePicPath) {
        throw new apiError(400, "Profile picture is required")
    }
    const uploaded = await uploadOnCloudinary(profilePicPath);
    if (!uploaded.url) {
        throw new apiError(500, "Failed to upload profile picture")
    }
    const user = await User.findByIdAndUpdate(req.user?._id, { $set: { profilePic: uploaded.url } }, { new: true })
        .select("-password -refreshToken");
    if (!user) {
        throw new apiError(404, "User not found")
    }
    return res.status(200).json(
        new apiResponse(
            200,
            user,
            "Profile picture updated successfully"
        )
    )
})

//get controllers
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) {
        throw new apiError(404, "User not found")
    }
    return res.status(200).json(
        new apiResponse(
            200,
            user,
            "User found successfully"
        )
    )
})

// delete 

const deleteUser = asyncHandler(async (req, res) => {
    const password = req.body.password;
    if (!password) {
        throw new apiError(400, "Password is required")
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new apiError(404, "User not found")
    }
    const isPasswordCorrect =
        await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new apiError(401, "Invalid credentials")
    }
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
    await user.deleteOne();
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new apiResponse(
                200,
                { message: "User deleted successfully" },
                "User deleted successfully"
            )
        )

})




export {
    registerUser
    , loginUser
    , logoutUser
    , refreshAccessToken
    , changePassword
    , updateAccountDetails
    , getCurrentUser
    , updateProfilePic
    , deleteUser
};