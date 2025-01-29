import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import logo from "../assets/logo.png";  // Import your logo image

const Navbar = ({ setDarkMode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Dropdown state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === "arshad@gmail.com") {
        setIsLoggedIn(true);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
<nav className="flex justify-between items-center px-6 py-4 bg-pink-50 text-pink-700 shadow-md rounded-b-lg h-20">
<Link to="/" className="flex items-center">
        {/* Use an img tag to display the logo */}
        <img src={logo} alt="BlogApp Logo" className="h-40 object-contain" />
        </Link>
      <div className="hidden md:flex items-center gap-6">
        <Link
          to="/"
          className="text-lg font-medium py-2 px-4 rounded-md text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-300"
        >
          Home
        </Link>
        
        {/* Login Button */}
        {!isLoggedIn && (
          <Link
            to="/login"
            className="text-lg font-medium py-2 px-4 rounded-md text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-300"
          >
            Login
          </Link>
        )}

        {/* Dark Mode Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-pink-50 text-pink-500 shadow hover:shadow-md transition-all duration-300"
        >
          {document.documentElement.classList.contains("dark") ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-pink-100 hover:bg-pink-200 text-pink-700 transition-all duration-300"
            >
              Admin <ChevronDownIcon className="h-5 w-5" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-12 right-0 bg-pink-100 text-pink-700 shadow-lg rounded-lg p-4 w-48">
                <Link
                  to="/admin"
                  className="block text-lg font-medium py-2 px-4 rounded-md hover:bg-pink-200 hover:text-pink-700 transition-all duration-300 mb-2"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Admin Panel
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left text-lg font-medium py-2 px-4 rounded-md hover:bg-pink-200 hover:text-pink-700 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="md:hidden flex items-center">
        {/* Dark Mode Button for Mobile */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-pink-50 text-pink-500 shadow hover:shadow-md transition-all duration-300"
        >
          {document.documentElement.classList.contains("dark") ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>

        <button
          onClick={toggleMenu}
          className="p-2 rounded-full bg-pink-50 text-pink-500 shadow hover:shadow-md transition-all duration-300 ml-4"
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-6 bg-pink-50 text-pink-700 shadow-lg rounded-lg p-4">
          <Link
            to="/"
            className="block text-lg font-medium py-2 px-4 rounded-md text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-300 mb-2"
            onClick={toggleMenu}
          >
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/admin"
                className="block text-lg font-medium py-2 px-4 rounded-md text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-300 mb-2"
                onClick={toggleMenu}
              >
                Admin Panel
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full text-left text-lg font-medium py-2 px-4 rounded-md text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-300"
              >
                Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
            <Link
              to="/login"
              className="block text-lg font-medium py-2 px-4 rounded-md text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-300"
              onClick={toggleMenu}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
