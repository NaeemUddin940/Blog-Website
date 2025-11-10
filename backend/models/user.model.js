import bcrypt from "bcryptjs";
import mongoose from "mongoose";

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

const User = mongoose.model("User", userSchema);
export default User;
