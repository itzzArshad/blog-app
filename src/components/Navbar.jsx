import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";

const Navbar = ({ setDarkMode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-pink-500 text-white shadow-lg rounded-b-lg">
      <Link
        to="/"
        className="text-3xl font-bold tracking-wide hover:text-pink-200 transition-colors"
      >
        BlogApp
      </Link>
      <div className="hidden md:flex items-center gap-6">
        <Link
          to="/"
          className="text-lg font-medium hover:text-pink-200 transition-colors"
        >
          Home
        </Link>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white text-pink-500 shadow hover:shadow-md transition"
        >
          {document.documentElement.classList.contains("dark") ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-md shadow text-white transition"
          >
            Logout
          </button>
        )}
      </div>
      <div className="md:hidden flex items-center">
        {/* Dark Mode Button for Mobile */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white text-pink-500 shadow hover:shadow-md transition"
        >
          {document.documentElement.classList.contains("dark") ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>

        <button
          onClick={toggleMenu}
          className="p-2 rounded-full bg-white text-pink-500 shadow hover:shadow-md transition ml-4"
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-6 bg-pink-500 text-white shadow-lg rounded-lg p-4">
          <Link
            to="/"
            className="block text-lg font-medium hover:text-pink-200 transition-colors mb-2"
            onClick={toggleMenu}
          >
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/admin"
                className="block text-lg font-medium hover:text-pink-200 transition-colors mb-2"
                onClick={toggleMenu}
              >
                Admin Panel
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="block w-full text-left text-lg font-medium hover:text-pink-200 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
