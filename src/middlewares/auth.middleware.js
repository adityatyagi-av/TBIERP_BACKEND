import {extendedclient as prisma} from "../models/prismaClient.js"
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

        

        const baseUrl = req.baseUrl.toString();
        

        if(baseUrl.includes("admin")){
            const id = decodedToken.id;
            const admin = await prisma.admin.findUnique({where:{id}, select:{id:true, username:true}})
            if (!admin) {
                throw new ApiError(401, "Invalid access token")
            }
            req.user = admin;
        } else if(baseUrl.includes("manager")){
            const id = decodedToken.id;
            const admin = await prisma.admin.findUnique({where:{id}, select:{id:true, username:true}})
            if (!manager) {
                throw new ApiError(401, "Invalid access token")
            }
            req.user = manager;
        } else if (baseUrl.includes("founder")){
            const id = decodedToken.id;
            const admin = await prisma.admin.findUnique({where:{id}, select:{id:true, username:true, managertype: true}})
            if (!admin) {
                throw new ApiError(401, "Invalid access token")
            }
            req.user = admin;
        }
        


        next();
        
    } catch(error) {
        throw new ApiError(402, error?.message || "Invalid access token")
    }
})


export { verifyJWT };