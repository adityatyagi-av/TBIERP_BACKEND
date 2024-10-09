import "dotenv/config";
import { extendedclient as prisma } from "../models/prismaClient.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (adminId) => {
    try {
        console.log("step1");
        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
        });
        console.log("step2");

        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }
        console.log("step3");

        const accessToken = await prisma.admin.SignAccessToken({ where: { id: admin.id}, });
        console.log("step4"); 
        const refreshToken = await prisma.admin.SignRefreshToken({ where: { id: admin.id}, data: {}, }); 

        console.log("step5");

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
};

const signupAdmin = asyncHandler(async(req,res) =>{
  const {username , email , password} =  await req.body;
  if (!username || !password ||!email) {
    throw new ApiError(400, "Username and Password   and Email are required");
}
const newAdmin = await prisma.admin.create({data:{username , email ,password}});
console.log(newAdmin);
return res
.status(200)
.json(new ApiResponse(200,  newAdmin , "Admin successfully created."));
})


const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new ApiError(400, "Username and Password are required");
    }

    const admin = await prisma.admin.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
        }
    });

    if (!admin) {
        throw new ApiError(400, "Invalid username or password");
    }

    const isPasswordCorrect = await prisma.admin.comparePassword({ data: { username, password },}); 

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin.id);

    const loggedInAdmin = await prisma.admin.findUnique({
        where: { id: admin.id },
        select: { id: true, username: true, email: true }, 
    });

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInAdmin, "Admin successfully logged in."));
});


const logoutAdmin = asyncHandler(async (req, res) => {
    await prisma.admin.update({
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
        .json(new ApiResponse(200, {}, "Admin logged out"));
});


const getAdminDetail = asyncHandler(async (req, res) => {
    const admin = await prisma.admin.findUnique({
        where: { id: req.user?.id },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, admin, "Admin details fetched successfully"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken ||!process.env.REFRESH_TOKEN_SECRET) {
        throw new ApiError(401, "Unauthorized request");
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const admin = await prisma.admin.findUnique({
            where: { id: decodedToken.id },
            select: {
                id: true,
                username: true,
                email: true,
                phone: true,
                avatar: true,
                refreshToken: true,
            }
        });
        if (!admin) {
            throw new ApiError(401, "Invalid refresh token");
        }
        if (incomingRefreshToken !== admin.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin.id);
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
        console.log(error);
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});


export {
    signupAdmin,
    loginAdmin,
    logoutAdmin,
    refreshAccessToken,
    getAdminDetail,
};
