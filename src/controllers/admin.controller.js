import "dotenv/config";
import { extendedclient as prisma } from "../models/prismaClient.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (founderId) => {
    try {
        const founder = await prisma.founder.findUnique({
            where: { id: founderId },
        });

        if (!founder) {
            throw new ApiError(404, "Founder not found");
        }

        const accessToken = prisma.founder.SignAccessToken(); 
        const refreshToken = prisma.founder.SignRefreshToken(); 

        await prisma.founder.update({
            where: { id: founderId },
            data: { refreshToken },
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
};


const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Username and Password are required");
    }

    const founder = await prisma.founder.findUnique({
        where: { username },
    });

    if (!founder) {
        throw new ApiError(400, "Invalid username or password");
    }

    const isPasswordCorrect = await founder.comparePassword(password); 

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(founder.id);

    const loggedInFounder = await prisma.founder.findUnique({
        where: { id: founder.id },
        select: { id: true, name: true, username: true, email: true }, 
    });

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInFounder, "Founder successfully logged in."));
});


const logoutAdmin = asyncHandler(async (req, res) => {
    await prisma.founder.update({
        where: { id: req.user.id },
        data: { refreshToken: null }, 
    });

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Founder logged out"));
});


const getAdminDetail = asyncHandler(async (req, res) => {
    const founder = await prisma.founder.findUnique({
        where: { id: req.user.id },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, founder, "Founder details fetched successfully"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const founder = await prisma.founder.findUnique({
            where: { id: decodedToken.id },
        });

        if (!founder) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== founder.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(founder.id);

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed successfully"));
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh token");
    }
});


export {
    loginAdmin,
    logoutAdmin,
    refreshAccessToken,
    getAdminDetail,
};
