import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: ``,
        localPath: "",
      },
    },
    username: {
      type: String,
      required: [true, "username is required and should be unique"],
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotpasswordexpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);
//password hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; //if password in not modified then don't do anything and save it
  // if password is modified then hash it and then save in same object name "password"
  this.password = await bcrypt.hash(this.password, 10);
});
//password comapring it give true or false
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
//generating access token carry user information
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};
//generating refresh token carry user information
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};
//generating temporary token that uses for password reset and verify the user that does not carry any information
userSchema.methods.generateTemporaryToken = function(){
  const unHashedToken = crypto.randomBytes(20).toString("hex")
  const HashedToken = crypto
              .createHash("sha256")
              .update(unHashedToken)
              .digest("hex")

  const TokenExpiry= Date.now() + (20*60*1000)//20 minutes from now
  return{unHashedToken,HashedToken,TokenExpiry}
};
export const User = model("User", userSchema);
