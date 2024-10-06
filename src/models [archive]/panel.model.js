import "dotenv/config";
import mongoose, { Schema } from "mongoose";


const panelSchema = Schema({
    members: [{
        type: Schema.Types.ObjectId,
        ref: "PanelMember"
    }]
}, {timestamps: true})




export const Panel = mongoose.model("Panel", panelSchema);