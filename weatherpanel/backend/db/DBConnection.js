import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = () => {
  const mongoUrl = process.env.MONGODB_URL; // Ensure the environment variable is available

  if (!mongoUrl) {
    console.error("MongoDB URL not found in environment variables");
    process.exit(1); // Exit if the MongoDB URL is not defined
  }

  mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1); // Exit the process in case of connection failure
    });
};

export default ConnectDB;
