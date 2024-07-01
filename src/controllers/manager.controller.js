import "dotenv/config";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from jsonwebtoken;
import { Manager } from "../models/manager.model.js";



const generateAccessAndRefreshToken = async (ManagerId) => {
    try {
        const manager = await Manager.findById(ManagerId);
    
        const accessToken = manager.SignAccessToken();
    
        const refreshToken = manager.SignRefreshToken();
    
        manager.refreshToken = refreshToken;
    
        await manager.save({validateBeforeSave: false})
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }

}

const loginManager = asyncHandler( async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        throw new ApiError(400, "Username and Password is required")
    }

    const manager = await Manager.findOne({username});

    if(!manager) {
        throw new ApiError(400, "Invalid username and password")
    }

    const isPasswordCorrect = await manager.comparepassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(manager._id)

    const loggedInManager = await Manager.findById(manager._id).select("-password -refreshToken")


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, loggedInManager, "Manager successfully logged in.")
    )

})


const logoutManager = asyncHandler( async (req, res) => {

    await Manager.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        })
    

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
})

const getManagerDetail = asyncHandler( async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "Manager data fetched successfully")
    )
})


const refreshAccessToken = asyncHandler ( async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    
    if (!incomingRefreshToken) {
        throw new ApiError(
            401, "Unauthorized request"
        )
    }

    try {
        const decodedRefreshToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        if (!decodedRefreshToken) {
            throw new ApiError(
                401,
                "Invalid Refresh Token"
            )
        }
    
    
        const manager = Manager.findById(decodedRefreshToken.id).select("-password -refreshToken")
    
        if (!manager) {
            throw new ApiError(401, "Invalid Refresh Token")
        }
    
        if (incomingRefreshToken !== manager?.refreshToken) {
            throw new ApiError(400, "Refresh token is expired or used")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(manager.id)

        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                manager,
                "Access Token refreshed successfully"
            )
        )
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


export {
    loginManager,
    logoutManager,
    getManagerDetail,
    refreshAccessToken,
}