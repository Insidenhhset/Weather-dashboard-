import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import Nav from "../Components/Nav";
import CheckAuthentication from "../Components/CheckAuthentication";
import {
  fetchUsers,
  BlockUser,
  DeleteUser,
  checkValidUser,
} from "../services/authService";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [users, setUsers] = useState([]);
  const socket = io(`${process.env.BOT_URL}`);
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

  socket.on("dashboardUpdate", (data) => {
    switch (data.event) {
      case "subscribe":
      case "unsubscribe":
      case "start":
      case "help":
        refreshDashboard();
        break;
      default:
        console.log("unhandled event", data.event);
    }
  });

  const refreshDashboard = async () => {
    const usersData = await fetchUsers();
    setUsers(usersData);
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  const handleblock = async (chatId) => {
    const checkStatus = await BlockUser(chatId);
    if (checkStatus.success) {
      toast.success(checkStatus.message);
    } else {
      toast.error(checkStatus.message);
    }
    refreshDashboard();
  };

  const handleDelete = async (chatId) => {
    const checkStatus = await DeleteUser(chatId);
    if (checkStatus.success) {
      toast.success(checkStatus.message);
    } else {
      toast.error(checkStatus.message);
    }
    refreshDashboard();
  };

  if (!isAuthenticated) {
    return <CheckAuthentication />; // Render authentication screen if the user is not authenticated
  }

  return (
    <div>
      <Nav />
      <div className="flex">
        <div className=" w-screen h-screen  bg-gray-400 lg:block"></div>
        <div className="flex-1 absolute top-14 right-0 bg-gray-600 w-full  overflow-auto">
          <div
            className="lg:ml-64  sm:ml-0 relative overflow-x-auto shadow-md rounded-lg"
            style={{ backgroundColor: "rgb(128,128,128)" }}
          >
            <h3
              className="text-xl text-white font-bold p-2"
              style={{ backgroundColor: "rgb(128,128,128)" }}
            >
              Available Users
            </h3>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Chat Id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3">
                    First Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Language
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Subscribed
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Blocked
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.chatId}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {user.chatId}
                    </th>
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.firstName}</td>
                    <td className="px-6 py-4">{user.language}</td>
                    <td className="px-6 py-4">
                      {user.subscribed ? "true" : "false"}
                    </td>
                    <td className="px-6 py-4">
                      {user.blocked ? "true" : "false"}
                    </td>
                    <td className="flex items-center px-6 py-4 space-x-3">
                      <Link
                        aria-disabled="true"
                        onClick={() => handleblock(user.chatId)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      >
                        {user.blocked ? "Blocked" : "Block"}
                      </Link>

                      <Link
                        onClick={() => handleDelete(user.chatId)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
