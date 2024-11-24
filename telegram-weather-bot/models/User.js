import mongoose from "mongoose";

// Define the user schema with default values for specific fields
const userSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true, // Ensuring chatId is unique
  },
  username: {
    type: String,
    required: true,
    default: "Unknown", // Default value if username is not provided
  },
  firstName: {
    type: String,
    required: true,
    default: "Unknown", // Default value if firstName is not provided
  },
  language: {
    type: String,
    default: "en", // Default language to "en" if not provided
  },
  subscribed: {
    type: Boolean,
    default: true, // Default to subscribed
  },
  blocked: {
    type: Boolean,
    default: false, // Default to not blocked
  },
});

// Create and export the model
const User = mongoose.model("users", userSchema);

export default User;
