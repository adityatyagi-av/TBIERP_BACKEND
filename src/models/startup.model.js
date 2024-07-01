import "dotenv/config"
import mongoose, { Schema } from "mongoose";


const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const teamMemberSchema = Schema({
    memberName: {
        type: String,
        required: true,
    },
    memberEmail:{ 
        type: String,
        validate: {
            validator: function(value) {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email"
        },
        lowercase: true
    }
}, {timestamps: true})

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

const startupSchema = new Schema({
    applicant:{
        type: ObjectId,
        ref: "Applicant",
        required: true,
    },
    teamMembers: [{
        type: Schema.Types.ObjectId,
        ref: "TeamMember"
    }],
    scheme: {        //for the scheme dropdown
        type: Schema.Types.ObjectId,
        ref: "Scheme",
        required: true
    },
    ideaDescription: {
        type: String,
        required: true
    },
    conceptNote: {
        type: String,   //cloudinary
        required: true
    },
    aspectNote: {
        type: String,  //cloudinary
        required: true
    },
    previousRecipient: {
        type: String,
        required: true,
        enum: {
            values:["yes", "no"]
        }
    },
    fullCommitment: {
        type: String,
        required: true,
        enum: {
            values:["yes", "no"]
        }
    },
    noOtherFellowship: {
        type: String,
        required: true,
        enum: {
            values:["yes", "no"]
        }
    },
    businessCommitment: {
        type: String,
        required: true,
        enum: {
            values:["yes", "no"]
        }
    },
    noBeneficiary: {
        type: String,
        required: true,
        enum: {
            values:["yes", "no"]
        }
    },
    registerPEP: {
        type: String,
        required: true,
        enum: {
            values:["yes", "no"]
        }
    },
}, {timestamps: true})


export const Startup = mongoose.model("Startup", startupSchema);