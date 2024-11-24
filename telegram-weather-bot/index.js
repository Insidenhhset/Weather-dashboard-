import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import fs from "fs";
import User from "./models/User.js";
import TelegramBot from "node-telegram-bot-api";
import { Server } from "socket.io";
import userRoutes from "./routes/userRoutes.js";
import checkUserStatus from "./utils/checkUserStatus.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(
  cors({
    origin: `${process.env.BASE_URL}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Connect to MongoDB
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
    startBot(); // Initialize the bot after DB connection
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1); // Exit process if DB connection fails
  }
};

//  connect DB
connectDb();

// Set up routes
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello, from Bot Server!!");
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize socket.io server
const io = new Server(server, {
  cors: {
    origin: `${process.env.BASE_URL}`,
    methods: ["GET", "POST"],
  },
});

// Emit events using io.emit()
io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
});

// Bot Setup
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

// Function to start the bot
const startBot = () => {
  bot.on("polling_error", (err) => {
    console.error("Error in polling:", err);
  });
};

startBot();

// Common function to handle user check and respond
const handleUserCheck = async (chatId, callback) => {
  const status = await checkUserStatus(chatId);
  if (!status.success) {
    bot.sendMessage(chatId, status.message); // Notify the user they're blocked
    return;
  }
  return callback(); // Only execute the callback if the user passes the check
};

// Helper function to update frontend dashboard
const updateDashboard = (event, chatId, data = {}) => {
  io.emit("dashboardUpdate", { event, chatId, ...data });
};

// Command Handlers
// Start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  await handleUserCheck(chatId, async () => {
    const user = await User.findOne({ chatId });

    if (!user) {
      bot.sendMessage(chatId, "Welcome! Use /help to see available commands.");
    } else {
      const message = user.subscribed
        ? "You are already subscribed to weather updates."
        : "You are unsubscribed from weather updates. Use /subscribe to get Weather Updates.";
      bot.sendMessage(chatId, message);
    }

    updateDashboard("start", chatId);
  });
});

// Help command
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;

  await handleUserCheck(chatId, () => {
    help(msg, bot);
    updateDashboard("help", chatId);
  });
});

// Subscribe command
bot.onText(/\/subscribe/, async (msg) => {
  const chatId = msg.chat.id;
  const { from } = msg;
  const {
    username = "Unknown",
    first_name: firstName = "Unknown",
    language_code: language = "en",
    is_bot: isBot,
  } = from;

  // If it's a bot, prevent subscription
  if (isBot) {
    return bot.sendMessage(chatId, "Bots are not allowed to subscribe.");
  }

  try {
    // Check eligibility of the user (for example, if they're blocked)
    const eligibility = await checkUserStatus(chatId);
    if (!eligibility.success) {
      return bot.sendMessage(chatId, eligibility.message);
    }

    // Check if the user already exists
    let user = await User.findOne({ chatId });

    if (!user) {
      // If the user does not exist, create a new user
      user = new User({
        chatId,
        username,
        firstName,
        language,
        subscribed: true,
        blocked: false, // Make sure user is not blocked by default
      });
      await user.save();
      bot.sendMessage(
        chatId,
        "You have successfully subscribed to weather updates."
      );
    } else {
      // If the user exists, just update the subscription status
      user.subscribed = true;
      user.blocked = false; // Ensure the user is not blocked
      await user.save();
      bot.sendMessage(
        chatId,
        "You have successfully re-subscribed to weather updates."
      );
    }

    // Optionally: update the dashboard or send additional feedback to the user
    updateDashboard("subscribe", chatId, { subscribed: true });
  } catch (error) {
    console.error("Error in subscribe command:", error);
    bot.sendMessage(
      chatId,
      "An error occurred while subscribing. Please try again later."
    );
  }
});

// Unsubscribe command
bot.onText(/\/unsubscribe/, async (msg) => {
  const chatId = msg.chat.id;

  await handleUserCheck(chatId, async () => {
    const user = await User.findOne({ chatId });

    if (!user) {
      return bot.sendMessage(
        chatId,
        "You are not subscribed to weather updates."
      );
    }

    user.subscribed = false;
    await user.save();

    bot.sendMessage(
      chatId,
      "You have successfully unsubscribed from weather updates."
    );
    updateDashboard("unsubscribe", chatId, { subscribed: false });
  });
});

// Message handler for weather requests
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text.startsWith("/")) return;

  await handleUserCheck(chatId, async () => {
    const user = await User.findOne({ chatId });

    if (!user) {
      return bot.sendMessage(
        chatId,
        "You have not subscribe to get weather updates. Use /subscribe to get weather updates."
      );
    }

    if (user && !user.subscribed) {
      return bot.sendMessage(
        chatId,
        "You are unsubscribed from weather updates. Use /subscribe to get weather updates."
      );
    }

    const city = text.trim();
    if (city) {
      weather(msg, city, bot);
    } else {
      bot.sendMessage(chatId, "Please send a valid city name.");
    }
  });
});

// Weather command
const weather = async (msg, city, bot) => {
  const chatId = msg.chat.id;
  try {
    // Check eligibility
    const eligibility = await checkUserStatus(chatId, bot);
    if (!eligibility.success)
      return bot.sendMessage(chatId, eligibility.message);

    // Validate the city input
    if (!city || typeof city !== "string" || city.trim().length === 0) {
      return bot.sendMessage(chatId, "Please provide a valid city name.");
    }

    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    // Destructure necessary data from the API response
    const { main, weather, name } = response.data;

    const weatherReport = `
🌦️ **Weather in ${name}:**
🌡️ **Temperature**: ${main.temp}°C
🌬️ **Condition**: ${weather[0].description}
💧 **Humidity**: ${main.humidity}%
💨 **Pressure**: ${main.pressure} hPa
`;
    return bot.sendMessage(chatId, weatherReport);
  } catch (error) {
    console.error("Weather API Error:", error.response?.data || error.message);
  }
};

// Help command
export const help = async (msg, bot) => {
  const chatId = msg.chat.id;

  // Check eligibility
  const eligibility = await checkUserStatus(chatId, bot);
  if (!eligibility.success) return bot.sendMessage(chatId, eligibility.message);

  const message = `
Welcome to the Weather Bot!
Here are the commands you can use:
- /subscribe: Subscribe to the bot
- /unsubscribe: Unsubscribe from the bot
- [city]: Get weather information for a city
- /help: Get help with bot commands
  `;
  bot.sendMessage(chatId, message);
};
