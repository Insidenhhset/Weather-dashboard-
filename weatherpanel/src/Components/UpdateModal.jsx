import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { updateApiKeys } from "../services/authService";

const UpdateModal = ({
  isOpen,
  closeModal,
  onSave,
  placeholder,
  currentApiKey,
  currentKeyType,
}) => {
  // Initialize state with currentApiKey
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [updatedapikey, setUpdatedapikey] = useState("");

  // Update apiKey whenever currentApiKey changes
  useEffect(() => {
    setApiKey(currentApiKey);
  }, [currentApiKey]); // Only run when currentApiKey changes

  // Save button handler
  const handleSave = async () => {
    if (updatedapikey !== "") {
      try {
        let res;
        if (currentKeyType === "weather") {
          res = await updateApiKeys({ weatherApiKey: updatedapikey });
        } else if (currentKeyType === "telegram") {
          res = await updateApiKeys({ telegramApiKey: updatedapikey });
        }

        setApiKey(updatedapikey);
        onSave(updatedapikey);

        if (res && res.message) {
          toast.success(res.message);
        } else {
          toast.success("API key updated successfully!");
        }
        setUpdatedapikey("");
        closeModal();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update API key!");
      }
    } else {
      toast.error("API key cannot be empty!");
    }
  };

  const handleCancel = () => {
    setUpdatedapikey("");
    closeModal();
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 pb-3">
                {placeholder}
              </h3>

              {/* Input Field */}
              <input
                type="text"
                value={updatedapikey}
                onChange={(e) => setUpdatedapikey(e.target.value)}
                className="w-full p-2 mb-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end gap-4">
                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Save
                </button>
                {/* Cancel Button */}
                <button
                  onClick={handleCancel}
                  className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg px-4 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateModal;
