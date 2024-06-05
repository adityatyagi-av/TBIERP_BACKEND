import "dotenv/config";
import mongoose from "mongoose";


const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phonerRegexPattern = /^\d{10}$/

const registrationSchema = new mongoose.Schema({
    applicantName:{
        type: String,
        required: true,
    },
    scheme: {        //for the scheme dropdown
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid E-mail."
        }
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return phonerRegexPattern.test(value);
            },
            message: "Please enter a valid Phone Number."
        }
    },
    postalAddress: {
        type: String,
        required: true,
    },
    DOB: {
        type: String,   //type Date
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: {
            values:["male", "female", "prefernottosay"],
        },
    },
    category: {
        type: String,
        required: true,
        enum: {
            values:["general", "obc", "sc", "st"]
        }
    },
    education: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    resume: {
        type: String,   //cloudinary
        required: true,
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
    
},
{timestamps: true}
);


export const Registration = mongoose.model("Registration", registrationSchema)