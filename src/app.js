import express from "express";
export const app=express();
import cookieParser from "cookie-parser";
import cors from "cors";
// import { rateLimit } from 'express-rate-limit'

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// import routes
import registerRouter from "./routes/registration.routes.js";



// declare routes
app.use("/api/", registerRouter);

//admin routes
import adminRouter from "./routes/admin.routes.js"
app.use("/api/admin", adminRouter);


//manager routes
import managerRouter from "./routes/manager.routes.js"
app.use("/api/manager", managerRouter)









//api requests limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
})



app.use(limiter)