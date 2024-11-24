import React, { useEffect, useState } from "react";
import Nav from "../Components/Nav";
import UpdateModal from "../Components/UpdateModal";
import { getApiKeys, checkValidUser } from "../services/authService";
import CheckAuthentication from "../Components/CheckAuthentication";

const UpdateApiKeys = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // null means authentication status is not yet checked
  const [weatherApiKey, setWeatherApiKey] = useState("");
  const [telegramBotApiKey, setTelegramBotApiKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKeyType, setCurrentKeyType] = useState(""); // Track which key is being updated
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    const validateUser = async () => {
      const isLoggedIn = localStorage.getItem("isAuthenticated") === "true"; // Check if the user is already logged in
      if (isLoggedIn) {
        setIsAuthenticated(true);
      } else {
        const result = await checkValidUser();
        if (result.status === 200) {
          localStorage.setItem("isAuthenticated", "true"); // Set the user as authenticated in localStorage
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }
    };

    validateUser(); // Call validateUser on component mount
  }, []);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const keys = await getApiKeys(); // Fetch the API keys
        setWeatherApiKey(keys.weatherApiKey);
        setTelegramBotApiKey(keys.telegramApiKey);
      } catch (err) {
        setError("Error fetching API keys. Please try again later.");
        console.error("Error fetching API keys:", err);
      }
    };

    if (isAuthenticated) {
      fetchApiKeys(); // Fetch API keys only if authenticated
    }
  }, [isAuthenticated]);

  const openModal = (keyType) => {
    setCurrentKeyType(keyType);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSaveApiKey = (newApiKey) => {
    if (currentKeyType === "weather") {
      setWeatherApiKey(newApiKey);
    } else if (currentKeyType === "telegram") {
      setTelegramBotApiKey(newApiKey);
    }
    closeModal();
  };

  if (!isAuthenticated) {
    return <CheckAuthentication />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <div className="bg-white shadow fixed top-0 w-full z-50">
        <Nav />
      </div>

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-4 lg:ml-64 sm:ml-0 mt-14">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Update API Keys
        </h1>
        <div className="space-y-6">
          <div className="p-4 bg-white rounded shadow-md">
            <p>
              Manage and update your API keys securely. Please ensure to keep
              your keys confidential.
            </p>
          </div>
        </div>

        {/* API Keys */}
        <div className="space-y-6 mt-6">
          <div className="p-4 bg-white rounded shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Weather API Key
            </h2>
            <p className="text-gray-600 mb-4">
              Current Key: <span className="font-mono">{weatherApiKey}</span>
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => openModal("weather")}
            >
              Update Weather API Key
            </button>
          </div>

          <div className="p-4 bg-white rounded shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Telegram Bot API Key
            </h2>
            <p className="text-gray-600 mb-4">
              Current Key:{" "}
              <span className="font-mono">{telegramBotApiKey}</span>
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => openModal("telegram")}
            >
              Update Telegram Bot API Key
            </button>
          </div>
        </div>

        {/* Error Handling */}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>

      {/* Update Modal */}
      <UpdateModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        onSave={handleSaveApiKey}
        placeholder={
          currentKeyType === "weather"
            ? "Enter new Weather API key"
            : "Enter new Telegram Bot API key"
        }
        currentApiKey={
          currentKeyType === "weather" ? weatherApiKey : telegramBotApiKey
        }
        currentKeyType={currentKeyType}
      />
    </div>
  );
};

export default UpdateApiKeys;
