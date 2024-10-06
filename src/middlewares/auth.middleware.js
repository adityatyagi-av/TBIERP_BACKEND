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

        

        const baseUrl = req.baseUrl;
        
        

        if(baseUrl.contains("admin")){
            const admin = await Admin.findById(decodedToken?.id).select("-password -refreshToken")
            if (!admin) {
                throw new ApiError(401, "Invalid access token")
            }
            req.user = admin;
        } else if(baseUrl.contains("manager")){
            const manager = await Manager.findById(decodedToken?.id).select("-password -refreshToken")
            if (!manager) {
                throw new ApiError(401, "Invalid access token")
            }
            req.user = manager;
        } else if (baseUrl.contains("founder")){
            const founder = await Founder.findById(decodedToken?.id).select("-password -refreshToken")
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