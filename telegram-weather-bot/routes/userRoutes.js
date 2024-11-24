import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import User from "../models/User.js"; // Import your User model
import checkAdminAuthentication from "../middleware/auth.js";

const router = express.Router();
dotenv.config();

// Route to get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Route to block a user (set blocked to true)
router.post("/block", async (req, res) => {
  const { chatId } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { chatId },
      { blocked: true },
      { new: true }
    );

    res.status(200).json({
      message: `User ${user.username} blocked successfully.`,
      user,
    });
  } catch (err) {
    console.error("Error blocking user:", err);
    res.status(500).json({ message: "Error blocking user" });
  }
});

// Route to unblock a user (set blocked to false)
router.post("/unblock", async (req, res) => {
  const { chatId } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { chatId },
      { blocked: false },
      { new: true }
    );

    res.status(200).json({
      message: `User ${user.username} unblocked successfully.`,
      user,
    });
  } catch (err) {
    console.error("Error unblocking user:", err);
    res.status(500).json({ message: "Error unblocking user" });
  }
});

// Route to delete a user from the database
router.delete("/delete", async (req, res) => {
  const { chatId } = req.body;

  try {
    const user = await User.findOneAndDelete({ chatId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User ${user.username} deleted successfully.`,
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

router.get("/apikeys", checkAdminAuthentication, (req, res) => {
  const apiKeys = {
    weatherApiKey: process.env.WEATHER_API_KEY,
    telegramApiKey: process.env.BOT_TOKEN,
  };

  return res.json(apiKeys);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/apikeys", checkAdminAuthentication, (req, res) => {
  const { weatherApiKey, telegramApiKey } = req.body;

  // Validate input
  if (!weatherApiKey && !telegramApiKey) {
    return res
      .status(400)
      .json({ error: "At least one API key must be provided" });
  }

  // Get the .env file path relative to the current file (using __dirname)
  const envPath = path.join(__dirname, "../.env");

  // Read the current .env content
  const envConfig = dotenv.parse(fs.readFileSync(envPath));

  // Update environment variables in memory
  if (weatherApiKey) {
    envConfig.WEATHER_API_KEY = weatherApiKey;
    process.env.WEATHER_API_KEY = weatherApiKey; // Update in-memory environment variable
    console.log("Weather API key updated:", weatherApiKey);
  }

  if (telegramApiKey) {
    envConfig.BOT_TOKEN = telegramApiKey;
    process.env.BOT_TOKEN = telegramApiKey; // Update in-memory environment variable
    console.log("Telegram Bot API key updated:", telegramApiKey);
  }

  // Write updated environment variables back to .env file
  const updatedEnv = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  try {
    // Write the updated environment variables to the .env file
    fs.writeFileSync(envPath, updatedEnv, "utf8");

    // Send response to client
    return res.json({
      message: "API keys updated successfully.",
    });
  } catch (error) {
    console.error("Error updating .env file:", error);
    return res.status(500).json({ error: "Failed to update API keys" });
  }
});

export default router;
