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



const logoutAdmin = asyncHandler(async(req,res) =>{
        await Admin.findByIdAndUpdate(
             req.user._id,
             {
                $unset: {
                    refreshToken: 1 // remove refresh token from db
                }
             },
             {
                new: true
             }


        )
        const options = {
            httpOnly: true,
            secure: true
        }

        //delete the token from cokie also
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "admin logged Out"))


}
)

const getAdminDetail = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "admin fetched successfully"
    ))
})



const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await Admin.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})





export {
    loginAdmin ,
    logoutAdmin,
    refreshAccessToken,
    getAdminDetail,


}