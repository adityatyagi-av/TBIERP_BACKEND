import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegexPattern = /^\d{10}$/


const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
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
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    phone:{
      type:String,
      validate: {
        validartor: function(value) { 
          return phoneRegexPattern.test(value);
        }
      },
      required: true
    },
    refreshToken: {
      type: String
    }
    
  },
  
  { timestamps: true }
);

// Hash Password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// sign access token
adminSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

// sign refresh token
adminSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

// compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
