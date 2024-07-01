//import http from "http";
import connectDB from "./utils/db.js";
import 'dotenv/config'
import { app } from "./app.js";
//const server = http.createServer(app);

// create server
app.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
    connectDB();
});


//change
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