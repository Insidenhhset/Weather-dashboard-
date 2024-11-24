import React, { useEffect, useState } from "react";
import MenuBar from "./MenuBar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../services/authService";

const Nav = () => {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [Dropdown, setDropDown] = useState(false);
  const navigate = useNavigate();
  const [useremail, setUseremail] = useState("");

  useEffect(() => {
    const getmail = localStorage.getItem("userEmail");
    if (getmail) {
      setUseremail(getmail);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarStatus(!sidebarStatus);
  };

  const toggleDropdown = () => {
    setDropDown(!Dropdown);
  };

  const handlelogout = async () => {
    try {
      const response = await logout();
      toast.success(response.message);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-50">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="logo-sidebar"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="#" className="flex ms-2 md:me-24">
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  WeatherBot Admin Panel
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                {/* User profile dropdown */}
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded={false}
                  aria-controls="dropdown-user"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://i.pravatar.cc/150?img=3"
                    alt="user photo"
                  />
                </button>
                {/* Dropdown menu */}
                {Dropdown && (
                  <div
                    className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 absolute right-1 top-10 w-48"
                    id="dropdown-user"
                  >
                    <div className="px-4 py-3" role="none">
                      <p
                        className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                        role="none"
                      >
                        {useremail}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      <li>
                        <a
                          onClick={handlelogout}
                          className="block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Sign out
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="lg:block hidden">
        <MenuBar />
      </div>

      <div>
        <MenuBar
          sidebarStatus={sidebarStatus}
          setSidebarStatus={setSidebarStatus}
        />
      </div>

      {/* Regular MenuBar shown on large screens */}
    </div>
  );
};

export default Nav;
