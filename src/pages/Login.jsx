import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Use the correct method 'signInWithPassword'
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (signInError) {
      setError("Invalid credentials. Please try again.");
      return;
    }
  
    const user = data.user;  // Get user from the returned data
  
    if (!user) {
      setError("User not found. Please check your credentials.");
      return;
    }
  
    // After successful login, check if the user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", user.id)
      .single();  // Only fetch one record since the id should be unique
  
    if (adminError) {
      setError("Error checking admin status. Please try again.");
    } else if (adminData && adminData.is_admin) {
      // If user is an admin, navigate to the admin panel
      navigate("/admin");
    } else {
      setError("You do not have admin privileges.");
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="p-8 bg-[var(--color-bg)] shadow-lg rounded-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-md bg-[var(--color-bg)] text-[var(--color-text)] dark:bg-darkGrey dark:text-white dark:border-gray-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md bg-[var(--color-bg)] text-[var(--color-text)] dark:bg-darkGrey dark:text-white dark:border-gray-600"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[var(--color-pink)] text-[var(--color-white)] rounded-md hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
