import "dotenv/config";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { extendedclient as prisma } from "../models/prismaClient.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (managerId) => {
    try {
        const manager = await prisma.manager.findUnique({
            where: { id: managerId },
        });
        if (!manager) throw new ApiError(404, "Manager not found");
        const accessToken = await prisma.manager.SignAccessToken({ where:{id: manager.id}, });
        const refreshToken = await prisma.manager.SignRefreshToken({ where:{id: manager.id}, data:{}, });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
};

const signupManger = asyncHandler(async (req,res)=>{
    const { username , password , email , type , managertype} = await req.body;
    if (!username || !password ||!email ||!managertype) {
        throw new ApiError(400, "Username and Password   and Email are required");
    }
    const newManager = await prisma.manager.create({data:{username , email ,password , managertype}});
    console.log(newManager);
    return res
    .status(200)
    .json(new ApiResponse(200,  newManager , "Manager successfully created."));
})

const loginManager = asyncHandler(async (req, res) => {
    const { username,  password ,email } = req.body;

    if ( (!email&&!username)|| !password) {
        throw new ApiError(400, "Username and Password are required");
    }


     let manager;
     if(email){
        manager = await prisma.manager.findUnique({ where: { email}, select: {
            id: true,
            email: true,
            username:true,
        } });
     }else{
        manager = await prisma.manager.findUnique({ where: {username}, select: {
            id: true,
            email: true,
            username:true,
        } });
     }
    if (!manager) {
       
        throw new ApiError(400, "Invalid email and password");
    }
   

    const isPasswordCorrect = await prisma.manager.comparePassword({ data: {username:manager.username , password}});
    
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(manager.id);
    const loggedInManager = await prisma.manager.findUnique({
        where: { id: manager.id },
        select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            avatar: true,
            
        },
    });

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInManager, "Manager successfully logged in."));
});

const logoutManager = asyncHandler(async (req, res) => {
    await prisma.manager.update({
        where: { id: req.user?.id },
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
        .json(new ApiResponse(200, {}, "Manager logged out successfully"));
});

const getManagerDetail = asyncHandler(async (req, res) => {
    const manager = await prisma.manager.findUnique({
        where: { id: req.user?.id }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, manager, "Manager data fetched successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedRefreshToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!decodedRefreshToken) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        const manager = await prisma.manager.findUnique({
            where: { id: decodedRefreshToken.id },
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                avatar: true,
                refreshToken: true,
            },
        });

        if (!manager) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (incomingRefreshToken !== manager.refreshToken) {
            throw new ApiError(400, "Refresh token is expired or used");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(manager.id);

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, {accessToken, refreshToken}, "Access Token refreshed successfully"));
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export {
    signupManger,
    loginManager,
    logoutManager,
    getManagerDetail,
    refreshAccessToken,
};
