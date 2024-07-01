import "dotenv/config"
import mongoose, { Schema } from "mongoose";


const evaluationSheetSchema = Schema({
    questions: [{
        type: Schema.Types.ObjectId,
        ref: "Question"
    }]
}, {timestamps: true})


export const Evaluation = mongoose.model("Evaluation", evaluationSheetSchema);