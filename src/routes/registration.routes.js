import { Router } from "express";
import { registerApplicant } from "../controllers/registration.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const registerRouter = Router();


registerRouter.route("/registerapplicant").post(
    upload.fields([
        {
            name: "resume",
            maxCount: 1
        },
        {
            name: "conceptNote",
            maxCount: 1
        },
        {
            name: "aspectNote",
            maxCount: 1
        }
    ]),
    registerApplicant
)


export default registerRouter;

