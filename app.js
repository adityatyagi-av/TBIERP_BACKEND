import express from "express";
export const app=express();
import cookieParser from "cookie-parser";
import cors from "cors";
import { rateLimit } from 'express-rate-limit'

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors => cross origin resource sharing
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

// api requests limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
})

// testing api
app.get("/test", (req ,res, next) => {
    res.status(200).json({
      succcess: true,
      message: "API is working",
    });
  });
  
// unknown route
app.all("*", (req,res,next) => {
    const err = new Error(`Route ${req.originalUrl} not found`) ;
    err.statusCode = 404;
    next(err);
  });
  
app.use(limiter)