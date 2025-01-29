import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Handle global dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark"); // Add dark mode to html
    } else {
      document.documentElement.classList.remove("dark"); // Remove dark mode from html
    }
  }, [darkMode]);

  return (
    <Router>
      <Navbar setDarkMode={setDarkMode} />
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/blog/:id" element={<BlogDetails darkMode={darkMode} />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
