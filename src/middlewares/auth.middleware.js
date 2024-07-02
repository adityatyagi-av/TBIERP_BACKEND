import { Admin } from "../models/admin.model.js";
import { Founder } from "../models/founder.model.js";
import { Manager } from "../models/manager.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const verifyJWT = asyncHandler( async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (!decodedToken) {
            throw new ApiError(402, "Invalid Access Token");    
        }

        const manager = await Manager.findById(decodedToken?.id).select("-password -refreshToken")
        const admin = await Admin.findById(decodedToken?.id).select("-password -refreshToken")
        const founder = await Founder.findById(decodedToken?.id).select("-password -refreshToken")

        const baseUrl = req.baseUrl;
        
        

        if(baseUrl.contains("admin")){
            if (!admin) {
                throw new ApiError(401, "Invalid access token")
            }
            req.user = admin;
        } else if(baseUrl.contains("manager")){
            if (!manager) {
                throw new ApiError(401, "Invalid access token")
            }
            req.user = manager;
        } else if (baseUrl.contains("founder")){
            if (!founder) {
                throw new ApiError(401, "Invalid access token")
            }
            req.user = founder;
        }
        


        next();
        
    } catch(error) {
        throw new ApiError(402, error?.message || "Invalid access token")
    }
})


export { verifyJWT };