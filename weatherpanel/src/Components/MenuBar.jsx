import React from "react";
import { Link } from "react-router-dom";

const MenuBar = ({ sidebarStatus, setSidebarStatus }) => {
  const handlesidebarClick = () => {
    setSidebarStatus(!sidebarStatus);
  };
  return (
    <div>
      {/* Sidebar, with dynamic classes based on sidebarStatus */}
      <aside
        onClick={handlesidebarClick} // Close sidebar when clicking inside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          sidebarStatus ? "translate-x-0" : "-translate-x-full"
        } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {/* Menu item for 'Manage Users' */}
            <li>
              <Link
                to="/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 20H7a1 1 0 0 1-1-1v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1a1 1 0 0 1-1 1ZM7.5 7a3.5 3.5 0 1 1 3.5 3.5A3.5 3.5 0 0 1 7.5 7Zm9 0a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z" />
                </svg>
                <span className="ms-3">Manage Users</span>
              </Link>
            </li>

            {/* Menu item for 'Update API Keys' */}
            <li>
              <Link
                to="/update-api-keys"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 15h4v-4h3l-5-5-5 5h3v4Zm8-3v2h-2v-2Zm2-6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
                </svg>
                <span className="ms-3">Update API Keys</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default MenuBar;
