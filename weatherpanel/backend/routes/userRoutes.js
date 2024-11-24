import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    // Compare entered password with stored hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Generate JWT token if passwords match
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login Successful!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // Check if email or password are missing
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email: email, password: hashedPassword });

    await newUser.save();

    // Successful signup
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

router.post("/dashboard", auth, async (req, res) => {
  try {
    // Access the user ID from the JWT token
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user-specific data
    res.json({
      message: "Dashboard data",
      user: user.email,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching dashboard data", error: err });
  }
});

router.post("/update-api-keys", auth, async (req, res) => {
  try {
    // Access the user ID from the JWT token
    const userId = req.user.id;

    // Fetch the user from the database (only admin can log in, so no need to check role)
    const user = await User.findById(userId).select("-password"); // We exclude the password field from the response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the new API key and its type from the request body
    const { apiKey, keyType } = req.body; // Expecting both apiKey and keyType in the request body

    if (!apiKey || !keyType) {
      return res
        .status(400)
        .json({ message: "API key and key type are required" });
    }

    // Validate the keyType and handle the keys accordingly
    if (keyType === "openweather") {
      // Validate OpenWeather API Key (this could be a simple regex check for a valid key format, or any validation logic)
      user.openWeatherApiKey = apiKey; // Store the OpenWeather API key in the user's document
    } else if (keyType === "telegram") {
      // Validate Telegram Bot Token (you can add a more specific check for a Telegram bot token format if needed)
      user.telegramBotToken = apiKey; // Store the Telegram Bot Token in the user's document
    } else {
      return res.status(400).json({ message: "Invalid key type" });
    }

    // Save the updated user document with the new API key
    await user.save();

    // Respond with success message
    res.json({ message: `${keyType} API key updated successfully` });
  } catch (err) {
    res.status(500).json({ message: "Error updating API key", error: err });
  }
});

router.get("/dashboard", auth, (req, res) => {
  // The user is authenticated
  res.status(200).json({ message: "User is authenticated" });
});

export default router;
