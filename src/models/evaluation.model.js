import "dotenv/config"
import mongoose, { Schema } from "mongoose";


const evaluationSchema = Schema({
    startup: {
        type: Schema.Types.ObjectId,
        ref: "Registration",
        required: true
    },
    scheme: {
        type: Schema.Types.ObjectId,
        ref: "Scheme"
    },
    panel: {
        type: Schema.Types.ObjectId,
        ref:"Panel" 
    },
    evaluatiohSheet: {
        type: Schema.Types.ObjectId,
        ref: "EvaluationSheet"
    }
}, {timestamps: true})


export const Evaluation = mongoose.model("Evaluation", evaluationSchema);