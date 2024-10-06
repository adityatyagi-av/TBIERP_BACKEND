import "dotenv/config"
import mongoose, { Schema } from "mongoose";


const guestSchema = Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    }
}, {timestapms: true})




export const Guest = mongoose.model("Guest", guestSchema);