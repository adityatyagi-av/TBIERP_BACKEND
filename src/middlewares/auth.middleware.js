import userModel from "../models/user.model.js";
import { jwt } from jsonwebtoken;



const verifyJWT = asynHandler( async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await userModel.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user

        next();
        
    } catch(error) {
        throw new ApiError(402, error?.message || "Invalid access token")
    }
})


export { verifyJWT };