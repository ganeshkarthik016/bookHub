import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../constants.js";

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

    const user = await User.create({
        userFullName: userFullName.trim().toUpperCase(),
        userName: userName.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        bio,
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
        const incomingrefreshToken = req.cookie.refreshAToken || req.body.refreshAToken
        if (!incomingrefreshToken) {
            throw new apiError(401, "Unauthorized access")
        }
        const decodedToken = jwt.verify(incomingrefreshToken, REFRESH_TOKEN_SECRET);
        if (!decodedToken) {
            throw new apiError(401, "Unauthorized access")
        }
        const user = await User.findById(decodedToken.id);
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
        new_accessToken = await user.generateAccessToken();
        new_refreshToken = await user.generateRefreshToken();
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
    } catch (error) {
        new apiError(401, eror?.message || "Somthing went wrong while refreshing the access token")
    }


})



export {
    registerUser
    , loginUser
    , logoutUser
    , refreshAccessToken

};