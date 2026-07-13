import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";

import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants";

import { User } from "../models/user.model";



export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) throw new apiError(401, "Unauthorized request");
        const verified = await jwt.verify(token, ACCESS_TOKEN_SECRET);
        if (!verified) throw new apiError(401, "Unauthorized request");
        const user = await User.findById(verified._id)
            .select("-password -refreshToken")
            .lean()
            .exec();
        if (!user) throw new apiError(401, "Unauthorized request");
        if (!user) {
            throw new apiError(401, "Invalid Access Token");
        }
        req.user = user
        next();

    }
    catch (Error) {
        throw new apiError(401, Error?.message || "Unauthorized request");
    }

})