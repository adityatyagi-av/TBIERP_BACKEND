import "dotenv/config";
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from jsonwebtoken;

const generateAccessAndRefreshToken = async (AdminId) => {
    try {
        const admin = await Admin.findById(AdminId);
    
        const accessToken = admin.SignAccessToken();
    
        const refreshToken = admin.SignRefreshToken();
    
        admin.refreshToken = refreshToken;
    
        await admin.save({validateBeforeSave: false})
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }

}

const loginAdmin = asyncHandler( async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        throw new ApiError(400, "Username and Password is required")
    }

    const admin = await Admin.findOne({username});

    if(!admin) {
        throw new ApiError(400, "Invalid username and password")
    }

    const isPasswordCorrect = await admin.comparepassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, loggedInAdmin, "Admin successfully logged in.")
    )

})