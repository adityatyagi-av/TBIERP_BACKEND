import "dotenv/config";
import mongoose, {Schema}  from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegexPattern = /^\d{10}$/;

const managerSchema = Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    managertype: {
        type: String,
        required: true,
        enum: {
            values: ["program manager", "incubation manager", "investment manager"]
        }
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
              return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email",
        },
        unique: true,
        lowercase: true
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
    avatar: {
        public_id: String,
        url: String
    },
    refreshToken: {
      type: String,
    }

}, {timestamps: true})

// Hash Password before saving
managerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  // sign access token
  managerSchema.methods.SignAccessToken = function () {
    return jwt.sign({ id: this._id, username: this.username, managertype:  this.managertype }, process.env.ACCESS_TOKEN || "", {
      expiresIn: "5m",
    });
  };
  
  // sign refresh token
  managerSchema.methods.SignRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
      expiresIn: "3d",
    });
  };
  
  // compare password
  managerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };


export const Manager = mongoose.model("Manager", managerSchema);