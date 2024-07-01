import "dotenv/config"
import mongoose, { Schema } from "mongoose";



const questionSchema = Schema({
    questionText: {
        type: String,
        required: true
    },
    Options: [{
        type: String
    }],
    evaluatedMarks: {
        type: String,
    },
    
}, {timestamps: true})





export const Question = mongoose.model("Question", questionSchema);