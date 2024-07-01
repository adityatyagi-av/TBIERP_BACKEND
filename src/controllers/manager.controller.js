import "dotenv/config";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from jsonwebtoken;
import { Manager } from "../models/manager.model.js";
import { response } from "express";



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




export {
    loginManager
}