import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    const { userFullName, email, userName, password, bio } = req.body;
    if (
        [userFullName, email, userName, password].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All required fields are required");
    }

    // Check if email already exists
    let existedUser = await User.findOne({
        email: email.trim().toLowerCase(),
    });

    if (existedUser) {
        throw new ApiError(409, "Email already exists");
    }

    // Check if username already exists
    existedUser = await User.findOne({
        userName: userName.trim().toLowerCase(),
    });

    if (existedUser) {
        throw new ApiError(409, "Username already exists");
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
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    // Return success response
    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});

export { registerUser };