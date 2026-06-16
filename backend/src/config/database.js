import { config } from "./config.js";
import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(config.MONGO_URI).then(() => {
    console.log("Connected to MongoDB...");
  });
};
