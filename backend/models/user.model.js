import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { env } from "../lib/env.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: null },
    bio: { type: String },
    role: { type: String, enum: ["user", "editor", "admin"], default: "user" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    isVerified: { type: Boolean, default: false },
    accessToken: { type: String },
    refreshToken: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      github: { type: String },
    },
  },
  { timestamps: true }
);

// Generate Unique UserName
userSchema.pre("save", async function (next) {
  try {
    if (!this.username) {
      this.username =
        this.name.toLowerCase().replace(/\s+/g, "") +
        Math.floor(Math.random() * 100000);
    }
    next();
  } catch (error) {
    console.error("Failed To Generate UserName", error);
  }
});

// Hashing Password
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    console.error("Failed To Bcrypt Password", error);
  }
});

// Generate Token
userSchema.statics.generateToken = async function (userId, res) {
  if (res.headersSent) return;
  const token = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days as a Mili Second (MS)
    httpOnly: true, // prevents XSS attacks: cross-site scripting
    sameSite: "strict", // CSRF Attacks
    secure: env.NODE_ENV === "production" ? true : false,
  });
  return token;
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
