import mongoose from "mongoose";
import { env } from "../lib/env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log(`✅ Successfully Database Connected`);
  } catch (error) {
    console.error(`❌ Database Connection have some issue:`, error);
  }
};

export default connectDB;
