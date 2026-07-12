import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res, next) => {

    const { fullName, email, userName, password } = req.body
    if (fullName === "" || email === "" || userName === "" || password === "") {
        throw new ApiError(402, "All fields are required")
    }
    let existedUser = await User.findOne({
        $or: [{ email }]
    })

    if (existedUser) {
        throw new ApiError(409, "email already exist")
    }
    existedUser = await User.findOne({
        $or: [{ userName }]
    })
    if (existedUser) {
        throw new ApiError(409, "username already exist")
    }


    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password
    })

    //checking if user is registered successfully
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }

    //return response
    return res.status(201).json(
        new ApiResponse(200, "registered successfully")
    )
})
export { registerUser }