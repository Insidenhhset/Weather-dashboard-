import User from "../models/User.js";

const checkUserStatus = async (chatId) => {
  try {
    // Find the user by chatId
    const user = await User.findOne({ chatId });

    if (!user) {
      // New user, allowed by default
      return {
        success: true,
        message: "Welcome! Use /help to see available commands.",
      };
    }

    // Check if the user is blocked
    if (user.blocked) {
      return {
        success: false,
        message: "You are blocked from using the bot. Please contact support.",
      };
    }

    // User exists and is not blocked
    return {
      success: true,
      message: "You are allowed to proceed.",
    };
  } catch (error) {
    console.error("Error checking user status:", error);

    // Return a failure response for unexpected errors
    return {
      success: false,
      message:
        "An error occurred while checking your status. Please try again later.",
    };
  }
};

export default checkUserStatus;
