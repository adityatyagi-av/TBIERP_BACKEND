import mongoose, { Schema } from "mongoose";
import bcrypt from bcryptjs;
import jwt from jsonwebtoken;


const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegexPattern = /^\d{10}$/

const founderSchema = Schema({
    name:{
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    startups: [{
        type: Schema.Types.ObjectId,
        ref: "Startup"
    }],
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid E-mail."
        },
        lowercase: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(value){
                return phoneRegexPattern.test(value);
            },
            message: "Please enter a valid Phone Number."
        }
    },
    postalAddress: {
        type: String,
        required: true,
    },
    DOB: {
        type: Date,   //type Date
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
    avatar: {
        public_id: String,
        url: String,   //cloudinary
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true})

// Hash Password before saving
founderSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
  
// sign access token
founderSchema.methods.SignAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
      expiresIn: "5m",
    });
};
  
// sign refresh token
founderSchema.methods.SignRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
      expiresIn: "3d",
    });
};

// compare password
founderSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


export const Founder = mongoose.model("Founder", founderSchema);