import {Router} from "express"
import{
    loginAdmin ,
    logoutAdmin,
    refreshAccessToken,
    getAdminDetail,
}
from "../controllers/admin.controller.js"  
import { verifyJWT } from "../middlewares/auth.middleware"
const router = Router();
router.route("/login").post(loginAdmin);
router.route("/logout").get(logoutAdmin);
router.route("/refresh-accessToken").get(refreshAccessToken);
router.route("/getdetail").get(verifyJWT,getAdminDetail);


export default router;