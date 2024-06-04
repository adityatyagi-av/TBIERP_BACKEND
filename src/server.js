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