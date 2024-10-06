import "dotenv/config"
import mongoose, { Schema } from "mongoose";


const panelMemberSchema = Schema({
    memberType: {
        type: String,
        required: true,
        enum: {
            values: ["Manager", "Guest"]
        }
    },
    member: {
        type: Schema.Types.ObjectId,
        refPath: "memberType",
        required: true
    }
}, {timestamps: true})




export const PanelMember = mongoose.model("PanelMember", panelMemberSchema);