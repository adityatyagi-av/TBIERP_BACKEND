import "dotenv/config";
import mongoose,  { Schema } from "mongoose";




const schemeSchema = new Schema({
    shemeName: {
        type: String,
        required: true
    },
    startups: [{
        type: Schema.Types.ObjectId,
        ref: "Startup"
    }],
    programManager: {
        type: Schema.Types.ObjectId,
        ref: "Manager"
    }
}, {timestamps: true})





export const Scheme = mongoose.model("Scheme", schemeSchema);