const login = async (email, password) => {
  try {
  
    const response = await fetch(`https://weatherbotdashboard.onrender.com/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if response is not ok (status code outside 2xx range)
    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error response:", errorData); // Check what error message comes from the backend
      throw new Error(errorData.message); // Throw error to be caught in catch block
    }

    // If login is successful
    const data = await response.json();

    // Store token in localStorage or use your state management
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userEmail", email);

    return data.message; // or return the whole data object if needed
  } catch (error) {
    console.log("Login failed:", error.message); // Log the error message
    throw error; // Rethrow the error so that the caller function can handle it
  }
};

const logout = async () => {
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    return { message: "Logout successful" };
  } catch (error) {
    console.log(error.message);
    throw new Error("Logout failed");
  }
};

const signup = async (email, password) => {
  try {
  

    const response = await fetch(`https://weatherbotdashboard.onrender.com/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 400) {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      throw new Error(errorMessage);
    }
    if (!response.ok) {
      // Handle error response
      const errorData = await response.json();
      const errorMessage = errorData.message;
      throw new Error(errorMessage);
    }

    // If response is successful, parse the response JSON
    const data = await response.json();
    return data.message;
  } catch (error) {
    throw new Error(
      error.message || "An unexpected error occurred during signup."
    );
  }
};

const fetchUsers = async () => {
  try {
 
    const response = await fetch(`https://weather-dashboard-o0hy.onrender.com/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  } catch (error) {
    console.log("Error fetching users:", error);
    throw new Error(error.message);
  }
};

const BlockUser = async (chatId) => {
  try {
   
    const response = await fetch(`https://weather-dashboard-o0hy.onrender.com/api/block`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId }),
    });

    const data = await response.json();

    if (response.status === 200 && data.success) {
      // Return success message or status to be used in the front-end
      return {
        success: true,
        message: data.message || "User blocked successfully.",
      };
    } else {
      // Return failure message if the response is not successful
      return {
        success: false,
        message: data.message || "Failed to block user.",
      };
    }
  } catch (error) {
    console.log("Error blocking user:", error);
    return {
      success: false,
      message: "An error occurred while blocking the user.",
    };
  }
};

const DeleteUser = async (chatId) => {
  try {
  
    const response = await fetch(`https://weather-dashboard-o0hy.onrender.com/api/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId }),
    });

    const data = await response.json();

    if (response.status === 200 && data.success) {
      // Return success message or status to be used in the front-end
      return {
        success: true,
        message: data.message || "User deleted successfully.",
      };
    } else {
      // Return failure message if the response is not successful
      return {
        success: false,
        message: data.message || "Failed to delete user.",
      };
    }
  } catch (error) {
    console.log("Error deleting user:", error);
    return {
      success: false,
      message: "An error occurred while deleting the user.",
    };
  }
};

const getApiKeys = async () => {
  try {
  

    const adminToken = localStorage.getItem("authToken");

    if (!adminToken) {
      console.error("Token is missing");
      return;
    }

    const response = await fetch(`https://weather-dashboard-o0hy.onrender.com/api/apikeys`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      window.location.href = "/"; // Redirect to login page
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch API keys");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching API keys:", error);
  }
};

const updateApiKeys = async (updates) => {
  try {
    
    const adminToken = localStorage.getItem("authToken");

    const response = await fetch(`https://weather-dashboard-o0hy.onrender.com/api/apikeys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updates), // Send only the updated keys
    });

    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      window.location.href = "/"; // Redirect to login page
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error updating API keys:", error);
  }
};

const checkValidUser = async () => {
  try {
   
    const token = localStorage.getItem("authToken");

    if (!token) {
      return { status: 401 };
    }

    const response = await fetch(`https://weatherbotdashboard.onrender.com/api/auth/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Return the response status code
    if (!response.ok) {
      return { status: response.status }; // Return status for further handling
    }

    // If everything is good, return 200 (authenticated)
    return { status: 200 };
  } catch (error) {
    console.error("Error while checking valid user:", error);
    return { status: 500 }; // Return 500 for unexpected errors
  }
};

export {
  login,
  logout,
  fetchUsers,
  BlockUser,
  DeleteUser,
  getApiKeys,
  updateApiKeys,
  checkValidUser,
  signup,
};
