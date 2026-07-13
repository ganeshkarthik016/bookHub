import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";

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


    // Create user
    const user = await User.create({
        userFullName: userFullName.trim(),
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
            { userName: userName.trim().toLowerCase() },
            { email: email.trim().toLowerCase() },
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



export {
    registerUser
    , loginUser
    , logoutUser
};