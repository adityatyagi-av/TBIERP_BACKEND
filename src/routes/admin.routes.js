import { Router } from "express";
import{
    signupAdmin,
    loginAdmin ,
    logoutAdmin,
    refreshAccessToken,
    getAdminDetail,
}
from "../controllers/admin.controller.js"  
import { verifyJWT } from "../middlewares/auth.middleware.js";



const adminRouter = Router();
adminRouter.route("/signup").post(signupAdmin);
adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/logout").get(verifyJWT, logoutAdmin);
adminRouter.route("/refresh-accessToken").get(refreshAccessToken);
adminRouter.route("/getdetail").get(verifyJWT,getAdminDetail);


export default adminRouter;