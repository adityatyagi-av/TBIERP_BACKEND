import { Router } from "express";
import {
    signupManger,
    loginManager,
    logoutManager,
    getManagerDetail,
    refreshAccessToken
} from "../controllers/manager.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const managerRouter = Router();

managerRouter.route("/signup").post(signupManger);
managerRouter.route("/login").post(loginManager);
managerRouter.route("/logout").get(verifyJWT, logoutManager);
managerRouter.route("/refresh-accessToken").get(refreshAccessToken);
managerRouter.route("/getdetail").get(verifyJWT,getManagerDetail);


export default managerRouter;