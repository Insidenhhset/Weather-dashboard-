import React from "react";

const PageNotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p
          className="text-blue-500 underline cursor-pointer"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Click here to log in
        </p>
      </div>
    </div>
  );
};

export default PageNotFound;
